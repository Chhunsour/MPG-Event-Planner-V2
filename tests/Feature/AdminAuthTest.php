<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Tests\TestCase;

class AdminAuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_successful_admin_login_always_lands_on_the_admin_dashboard(): void
    {
        $this->withoutMiddleware(PreventRequestForgery::class);
        $user = User::factory()->create([
            'email' => 'admin@example.test',
            'is_admin' => true,
        ]);

        $response = $this->withSession([
            'url.intended' => url('/'),
        ])->post(route('admin.login.attempt'), [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertRedirect(route('admin.dashboard'));
        $this->assertAuthenticatedAs($user);
    }
}
