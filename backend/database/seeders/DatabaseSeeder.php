<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        $organizer = User::create([
            'name' => 'Jordan Organizer',
            'email' => 'organizer@example.com',
            'password' => Hash::make('password'),
            'role' => 'organizer',
        ]);

        User::create([
            'name' => 'Alex Attendee',
            'email' => 'attendee@example.com',
            'password' => Hash::make('password'),
            'role' => 'attendee',
        ]);

        $events = Event::factory()
            ->count(6)
            ->for($organizer, 'organizer')
            ->create();

        foreach ($events as $event) {
            $event->ticketTypes()->create([
                'name' => 'General Admission',
                'price_cents' => fake()->numberBetween(1500, 5000),
                'quantity_total' => 100,
            ]);

            $event->ticketTypes()->create([
                'name' => 'VIP',
                'description' => 'Front row + backstage access.',
                'price_cents' => fake()->numberBetween(8000, 15000),
                'quantity_total' => 20,
            ]);
        }
    }
}
