<?php

namespace App\Enums\Traits;

trait HasIcon {
    public function icon(): ?string {
        
        if (file_exists(public_path("icons/{$this->value}.png"))) {
            return "/icons/{$this->value}.png";
        }

        return null;
    }
}
