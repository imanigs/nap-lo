<?php

namespace App\Notifications;

use App\Data\LogEntry;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LogEntryReminder extends Notification implements ShouldQueue {
    use Queueable;

    protected array $payload;

    public function __construct(LogEntry $logEntry) {
        $this->payload = [
            'horse_id' => $logEntry->horse->id,
            'horse' => $logEntry->horse->name,
            'log_id' => $logEntry->logId,
            'title' => $logEntry->title,
            'kind' => $logEntry->kind->value,
            'category' => $logEntry->detail['category'] ?? null,
            'date' => $logEntry->date->toDateString(),
            'time' => $logEntry->time,
            'url' => route('horses.show', [
                'horse' => $logEntry->horse->id,
                'tab' => $logEntry->kind->value,
            ], false),
        ];
    }

    public function via(object $notifiable): array {
        return $notifiable->email_notifications ? ['database', 'mail'] : ['database'];
    }

    public function toMail(object $notifiable): MailMessage {
        return (new MailMessage)
            ->subject('Emlékeztető: '.$this->payload['title'].' - '.$this->payload['horse'])
            ->greeting('Kedves '.$notifiable->name.'!')
            ->line('Emlékeztető - '.$this->payload['horse'].' - '.$this->payload['title'])
            ->line('Időpont: '.trim($this->payload['date'].' '.$this->payload['time']))
            ->action('Megnyitás', url($this->payload['url']));
    }

    public function toArray(object $notifiable): array {
        return $this->payload;
    }
}
