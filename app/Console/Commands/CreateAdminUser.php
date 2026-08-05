<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

/**
 * Creates the first (or an additional) admin account.
 *
 * The password is never taken from an argument or an env var — it is prompted
 * for and hidden, so it does not end up in shell history, `ps` output or a
 * committed file. There are no seeded default credentials anywhere.
 */
class CreateAdminUser extends Command
{
    protected $signature = 'mpg:create-admin
                            {--name= : Display name}
                            {--email= : Login email}';

    protected $description = 'Create an MPG admin account (prompts for the password)';

    public function handle(): int
    {
        $name = $this->option('name') ?: $this->ask('Name');
        $email = $this->option('email') ?: $this->ask('Email');

        if (User::where('email', $email)->exists()) {
            $this->error("An account already exists for {$email}.");

            return self::FAILURE;
        }

        $password = $this->secret('Password');
        $confirm = $this->secret('Confirm password');

        if ($password !== $confirm) {
            $this->error('Passwords do not match.');

            return self::FAILURE;
        }

        $validator = Validator::make(
            compact('name', 'email', 'password'),
            [
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'email', 'max:255', 'unique:users,email'],
                'password' => ['required', Password::min(12)->letters()->numbers()->symbols()],
            ]
        );

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $error) {
                $this->error($error);
            }

            return self::FAILURE;
        }

        User::create([
            'name' => $name,
            'email' => $email,
            'password' => $password, // hashed by the model cast
            'is_admin' => true,
        ]);

        $this->info("Admin account created for {$email}.");
        $this->line('Sign in at /admin/login');

        return self::SUCCESS;
    }
}
