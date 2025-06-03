import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Message {
  id: number;
  created_at: string;
  user_id: string;
  content: string;
  user_email: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  constructor() {
    this.subscribeToMessages();
  }

  private async subscribeToMessages() {
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }

    // Process messages to get signed URLs for images
    const processedMessages = await Promise.all(
      messages.map(async (message) => {
        if (this.isImageMessage(message.content)) {
          const imageUrl = this.getImageUrl(message.content);
          const signedUrl = await this.getImageUrl(imageUrl);
          return { ...message, content: `🖼️ Image: ${signedUrl}` };
        }
        return message;
      })
    );

    this.messagesSubject.next(processedMessages);

    // Subscribe to new messages
    supabase
      .channel('messages')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages' },
        async (payload) => {
          const newMessage = payload.new as Message;
          if (this.isImageMessage(newMessage.content)) {
            const imageUrl = this.getImageUrl(newMessage.content);
            const signedUrl = await this.getImageUrl(imageUrl);
            newMessage.content = `🖼️ Image: ${signedUrl}`;
          }
          this.messagesSubject.next([...this.messagesSubject.value, newMessage]);
        }
      )
      .subscribe();
  }

  private isImageMessage(content: string): boolean {
    return content.startsWith('🖼️ Image: http');
  }

  private getImageUrl(content: string): string {
    return content.replace('🖼️ Image: ', '');
  }


  async sendMessage(content: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user logged in');

    const { error } = await supabase
      .from('messages')
      .insert([
        {
          content,
          user_email: user.email,
          user_id: user.id
        }
      ]);

    if (error) throw error;
  }
}
