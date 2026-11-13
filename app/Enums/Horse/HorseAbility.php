<?php

namespace App\Enums\Horse;

enum HorseAbility: string {
    case VIEW_PROFILE = 'view_profile';
    case EDIT_PROFILE = 'edit_profile';
    case VIEW_SHARES = 'view_shares';
    case MANAGE_SHARES = 'manage_shares';
    case DELETE = 'delete';
    case VIEW_FEED = 'view_feed';
    case EDIT_FEED = 'edit_feed';
    case VIEW_EXERCISE = 'view_exercise';
    case EDIT_EXERCISE = 'edit_exercise';
    case VIEW_HEALTH = 'view_health';
    case EDIT_HEALTH = 'edit_health';
    case VIEW_OBSERVATION = 'view_observation';
    case EDIT_OBSERVATION = 'edit_observation';
}
