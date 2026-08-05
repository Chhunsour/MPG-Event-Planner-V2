<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seeds site content only.
     *
     * No user is created here on purpose — an admin account must be made with
     * `php artisan mpg:create-admin`, which prompts for a password. Seeding a
     * default account would put working credentials in version control.
     */
    public function run(): void
    {
        $this->call([
            AdminUserSeeder::class,
            ContentSeeder::class,
        ]);
    }
}
