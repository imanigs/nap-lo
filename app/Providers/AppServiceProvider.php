<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider {
    public function register(): void {}

    public function boot(): void {
        $this->configureDefaults();

        JsonResource::withoutWrapping();

        VerifyEmail::toMailUsing(function (object $notifiable, string $url) {
            return (new MailMessage)
                ->subject('Kérjük, erősítsd meg az e-mail címed')
                ->greeting('Kedves '.$notifiable->name.'!')
                ->line('Kérlek, kattints az alábbi gombra az email címed megerősítéséhez.')
                ->action('Email cím megerősítése', $url)
                ->line('Ha nem te regisztráltál, nincs további teendőd.');
        });

        ResetPassword::toMailUsing(function (object $notifiable, string $token) {
            $url = url(route('password.reset', [
                'token' => $token,
                'email' => $notifiable->getEmailForPasswordReset(),
            ], false));

            return (new MailMessage)
                ->subject('Jelszó visszaállítása')
                ->greeting('Kedves '.$notifiable->name.'!')
                ->line('Ezt az emailt azért kaptad, mert jelszó-visszaállítási '
                    .'kérelmet indítottak a fiókodhoz.')
                ->action('Jelszó visszaállítása', $url)
                ->line('Ez a link 60 perc múlva lejár.')
                ->line('Ha nem te indítottad a kérelmet, nincs további teendőd.');
        });
    }

    protected function configureDefaults(): void {
        Date::use(CarbonImmutable::class);

        Model::preventLazyLoading(! app()->isProduction());

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
