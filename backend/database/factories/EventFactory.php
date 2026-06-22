<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class EventFactory extends Factory
{
    public function definition(): array
    {
        $start = fake()->dateTimeBetween('+1 week', '+3 months');

        return [
            'organizer_id' => User::factory(),
            'title' => fake()->sentence(3),
            'description' => fake()->paragraphs(3, true),
            'venue' => fake()->company().' Hall',
            'address' => fake()->address(),
            'starts_at' => $start,
            'ends_at' => (clone $start)->modify('+3 hours'),
            'cover_image_url' => null,
            'status' => 'published',
        ];
    }
}
