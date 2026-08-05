<?php

namespace Tests\Feature;

use App\Models\BlogPost;
use App\Models\Project;
use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminPublishingWorkflowTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');
        $this->admin = User::factory()->create(['is_admin' => true]);
        $this->actingAs($this->admin);
    }

    public function test_service_can_move_from_draft_through_image_edit_publish_unpublish_republish_and_delete(): void
    {
        $create = $this->post(route('admin.services.store'), [
            'title_en' => 'Workflow Service',
            'slug' => 'workflow-service',
            'description_en' => '<p>Service detail</p>',
            'capabilities' => [['label_en' => 'Planning support']],
            'publish_intent' => '0',
            'image' => UploadedFile::fake()->image('service-one.jpg', 800, 600),
        ]);

        $service = Service::query()->where('slug', 'workflow-service')->firstOrFail();
        $firstImage = $service->image;

        $create->assertRedirect(route('admin.services.index'));
        $this->assertFalse($service->is_published);
        Storage::disk('public')->assertExists($firstImage);
        $this->getJson('/api/services/workflow-service')
            ->assertNotFound();

        $this->put(route('admin.services.update', $service), [
            'title_en' => 'Workflow Service Updated',
            'slug' => 'workflow-service',
            'description_en' => '<p>Updated detail</p>',
            'capabilities' => [['label_en' => 'Planning support', 'label_km' => 'ការគាំទ្រ']],
            'publish_intent' => '1',
            'image' => UploadedFile::fake()->image('service-two.jpg', 800, 600),
        ])->assertRedirect(route('admin.services.index'));

        $service->refresh();
        $this->assertTrue($service->is_published);
        $this->assertNotSame($firstImage, $service->image);
        Storage::disk('public')->assertMissing($firstImage);
        Storage::disk('public')->assertExists($service->image);
        $currentImage = $service->image;
        $this->getJson('/api/services/workflow-service?locale=km')
            ->assertOk()
            ->assertJsonPath('data.title', 'Workflow Service Updated')
            ->assertJsonPath('data.capabilities.0', 'ការគាំទ្រ');

        $this->put(route('admin.services.update', $service), [
            'title_en' => 'Workflow Service Updated',
            'slug' => 'workflow-service',
            'publish_intent' => '1',
            'remove_image' => '1',
        ])->assertRedirect(route('admin.services.index'));
        $service->refresh();
        $this->assertNull($service->image);
        Storage::disk('public')->assertMissing($currentImage);

        $this->post(route('admin.services.publish', $service), ['is_published' => '0'])->assertRedirect();
        $this->getJson('/api/services/workflow-service')->assertNotFound();
        $this->post(route('admin.services.publish', $service), ['is_published' => '1'])->assertRedirect();
        $this->post(route('admin.services.publish', $service), ['is_published' => '1'])->assertRedirect();
        $this->getJson('/api/services/workflow-service')->assertOk();

        $this->delete(route('admin.services.destroy', $service))->assertRedirect(route('admin.services.index'));
        $this->assertSoftDeleted('services', ['id' => $service->id]);
        $this->getJson('/api/services/workflow-service')->assertNotFound();
    }

    public function test_project_can_persist_cover_gallery_features_and_public_visibility(): void
    {
        $this->post(route('admin.projects.store'), [
            'title_en' => 'Workflow Project',
            'slug' => 'workflow-project',
            'category' => 'Corporate ceremony',
            'technologies_text' => 'LED, sound, staging',
            'short_description_en' => 'Project summary',
            'description_en' => '<p>Project detail</p>',
            'features' => [['label_en' => 'Stage build']],
            'publish_intent' => '0',
            'cover_image' => UploadedFile::fake()->image('cover-one.jpg', 800, 600),
            'gallery' => [UploadedFile::fake()->image('gallery-one.jpg', 800, 600)],
        ])->assertRedirect();

        $project = Project::query()->where('slug', 'workflow-project')->firstOrFail();
        $firstCover = $project->cover_image;
        $this->assertFalse($project->is_published);
        $this->assertCount(1, $project->images);
        $this->assertCount(1, $project->features);
        $this->assertSame(['LED', 'sound', 'staging'], $project->technologies);
        Storage::disk('public')->assertExists($firstCover);
        $this->getJson('/api/projects/workflow-project')->assertNotFound();

        $this->post(route('admin.projects.publish', $project))->assertRedirect();
        $this->getJson('/api/projects/workflow-project')
            ->assertOk()
            ->assertJsonPath('data.title', 'Workflow Project')
            ->assertJsonPath('data.features.0', 'Stage build')
            ->assertJsonCount(1, 'data.gallery');

        $this->put(route('admin.projects.update', $project), [
            'title_en' => 'Workflow Project Updated',
            'slug' => 'workflow-project',
            'description_en' => '<p>Updated project detail</p>',
            'features' => [['label_en' => 'Updated stage build']],
            'publish_intent' => '1',
            'cover_image' => UploadedFile::fake()->image('cover-two.jpg', 800, 600),
        ])->assertRedirect();

        $project->refresh();
        $this->assertNotSame($firstCover, $project->cover_image);
        Storage::disk('public')->assertMissing($firstCover);
        Storage::disk('public')->assertExists($project->cover_image);
        $currentCover = $project->cover_image;
        $this->getJson('/api/projects/workflow-project')->assertJsonPath('data.title', 'Workflow Project Updated');

        $this->put(route('admin.projects.update', $project), [
            'title_en' => 'Workflow Project Updated',
            'slug' => 'workflow-project',
            'publish_intent' => '1',
            'remove_cover_image' => '1',
        ])->assertRedirect();
        $project->refresh();
        $this->assertNull($project->cover_image);
        Storage::disk('public')->assertMissing($currentCover);

        $this->post(route('admin.projects.publish', $project), ['is_published' => '0'])->assertRedirect();
        $this->getJson('/api/projects/workflow-project')->assertNotFound();
        $this->post(route('admin.projects.publish', $project), ['is_published' => '1'])->assertRedirect();
        $this->post(route('admin.projects.publish', $project), ['is_published' => '1'])->assertRedirect();
        $this->delete(route('admin.projects.destroy', $project))->assertRedirect(route('admin.projects.index'));
        $this->assertSoftDeleted('projects', ['id' => $project->id]);
    }

    public function test_blog_post_can_persist_draft_publish_edit_image_unpublish_republish_and_delete(): void
    {
        $this->post(route('admin.blog.store'), [
            'title_en' => 'Workflow Article',
            'slug' => 'workflow-article',
            'excerpt_en' => 'Article summary',
            'body_en' => '<p><strong>Article body</strong></p>',
            'author_name' => 'MPG Team',
            'category' => 'Planning guides',
            'tags_text' => 'planning, production',
            'seo_title_en' => 'Workflow article SEO title',
            'seo_description_en' => 'Workflow article search description',
            'published_at' => now()->toDateString(),
            'is_published' => '0',
            'cover_image' => UploadedFile::fake()->image('blog-one.jpg', 800, 600),
            'social_image' => UploadedFile::fake()->image('blog-social-one.jpg', 800, 600),
        ])->assertRedirect();

        $post = BlogPost::query()->where('slug', 'workflow-article')->firstOrFail();
        $firstCover = $post->cover_image;
        $this->assertFalse($post->is_published);
        $this->assertSame('Planning guides', $post->category);
        $this->assertSame(['planning', 'production'], $post->tags);
        $this->assertSame('Workflow article SEO title', $post->seo_title_en);
        Storage::disk('public')->assertExists($firstCover);
        Storage::disk('public')->assertExists($post->social_image);
        $this->getJson('/api/blog/workflow-article')->assertNotFound();

        $this->post(route('admin.blog.publish', $post))->assertRedirect();
        $this->getJson('/api/blog/workflow-article')
            ->assertOk()
            ->assertJsonPath('data.title', 'Workflow Article')
            ->assertJsonPath('data.body', '<p><strong>Article body</strong></p>');

        $this->put(route('admin.blog.update', $post), [
            'title_en' => 'Workflow Article Updated',
            'slug' => 'workflow-article',
            'body_en' => '<p>Updated article</p>',
            'published_at' => now()->toDateString(),
            'is_published' => '1',
            'cover_image' => UploadedFile::fake()->image('blog-two.jpg', 800, 600),
        ])->assertRedirect();

        $post->refresh();
        $this->assertNotSame($firstCover, $post->cover_image);
        Storage::disk('public')->assertMissing($firstCover);
        Storage::disk('public')->assertExists($post->cover_image);
        $this->getJson('/api/blog/workflow-article')->assertJsonPath('data.title', 'Workflow Article Updated');

        $this->post(route('admin.blog.publish', $post), ['is_published' => '0'])->assertRedirect();
        $this->getJson('/api/blog/workflow-article')->assertNotFound();
        $this->post(route('admin.blog.publish', $post), ['is_published' => '1'])->assertRedirect();
        $this->post(route('admin.blog.publish', $post), ['is_published' => '1'])->assertRedirect();
        $this->delete(route('admin.blog.destroy', $post))->assertRedirect(route('admin.blog.index'));
        $this->assertSoftDeleted('blog_posts', ['id' => $post->id]);
    }

    public function test_blog_publish_checkbox_assigns_a_date_when_the_date_field_is_blank(): void
    {
        $this->post(route('admin.blog.store'), [
            'title_en' => 'Undated Workflow Article',
            'slug' => 'undated-workflow-article',
            'is_published' => '1',
        ])->assertRedirect();

        $post = BlogPost::query()->where('slug', 'undated-workflow-article')->firstOrFail();
        $this->assertTrue($post->is_published);
        $this->assertNotNull($post->published_at);
        $this->getJson('/api/blog/undated-workflow-article')->assertOk();
    }

    public function test_admin_can_duplicate_archive_restore_and_bulk_update_services(): void
    {
        $this->post(route('admin.services.store'), [
            'title_en' => 'Action Service',
            'slug' => 'action-service',
            'publish_intent' => '1',
        ])->assertRedirect();

        $service = Service::query()->where('slug', 'action-service')->firstOrFail();
        $this->post(route('admin.services.duplicate', $service))->assertRedirect();
        $copy = Service::query()->where('slug', 'action-service-copy')->firstOrFail();
        $this->assertFalse($copy->is_published);

        $this->delete(route('admin.services.destroy', $service))->assertRedirect();
        $this->get(route('admin.services.index', ['status' => 'archived']))
            ->assertOk()
            ->assertSee('Action Service');
        $this->post(route('admin.services.restore', $service))->assertRedirect();
        $this->assertFalse($service->fresh()->is_published);

        $this->post(route('admin.services.bulk'), [
            'ids' => [$service->id, $copy->id],
            'action' => 'publish',
        ])->assertRedirect();
        $this->assertTrue($service->fresh()->is_published);
        $this->assertTrue($copy->fresh()->is_published);
    }

    public function test_all_three_editors_use_the_shared_beginner_friendly_workflow(): void
    {
        foreach (['admin.blog.create', 'admin.services.create', 'admin.projects.create'] as $routeName) {
            $this->get(route($routeName))->assertOk();
        }
    }

    public function test_generated_metadata_is_applied_without_overriding_manual_values(): void
    {
        Service::create(['title_en' => 'Existing service', 'slug' => 'existing-service', 'display_order' => 4]);

        $this->post(route('admin.services.store'), [
            'title_en' => 'Premium Launch Production',
            'short_description_en' => 'Detailed ceremony planning and technical production.',
            'description_en' => '<p>Lighting staging logistics coordination</p>',
            'publish_action' => 'draft',
        ])->assertRedirect();

        $service = Service::query()->where('slug', 'premium-launch-production')->firstOrFail();
        $this->assertSame('Premium Launch Production', $service->seo_title_en);
        $this->assertSame('Detailed ceremony planning and technical production.', $service->seo_description_en);
        $this->assertSame('Premium Launch Production', $service->image_alt_en);
        $this->assertSame($this->admin->name, $service->author_name);
        $this->assertSame(5, $service->display_order);
        $this->assertContains('premium', $service->tags);

        $this->put(route('admin.services.update', $service), [
            'title_en' => 'Renamed Launch Production',
            'slug' => 'manual-service-url',
            'short_description_en' => 'Updated summary',
            'seo_title_en' => 'Manual search title',
            'image_alt_en' => 'Manual image description',
            'author_name' => 'Editorial Team',
            'display_order' => 12,
            'tags_text' => 'manual, curated',
            'publish_action' => 'draft',
        ])->assertRedirect();

        $service->refresh();
        $this->assertSame('manual-service-url', $service->slug);
        $this->assertSame('Manual search title', $service->seo_title_en);
        $this->assertSame('Manual image description', $service->image_alt_en);
        $this->assertSame('Editorial Team', $service->author_name);
        $this->assertSame(12, $service->display_order);
        $this->assertSame(['manual', 'curated'], $service->tags);
    }

    public function test_blog_service_and_project_can_be_scheduled_and_stay_private_until_due(): void
    {
        $this->actingAs(User::factory()->create(['is_admin' => true]));
        $publishAt = now()->addDay()->startOfMinute();

        $this->post(route('admin.blog.store'), [
            'title_en' => 'Scheduled Article',
            'published_at' => $publishAt->format('Y-m-d H:i:s'),
            'publish_action' => 'schedule',
        ])->assertRedirect();
        $this->post(route('admin.services.store'), [
            'title_en' => 'Scheduled Service',
            'published_at' => $publishAt->format('Y-m-d H:i:s'),
            'publish_action' => 'schedule',
        ])->assertRedirect();
        $this->post(route('admin.projects.store'), [
            'title_en' => 'Scheduled Project',
            'published_at' => $publishAt->format('Y-m-d H:i:s'),
            'publish_action' => 'schedule',
        ])->assertRedirect();

        $this->getJson('/api/blog/scheduled-article')->assertNotFound();
        $this->getJson('/api/services/scheduled-service')->assertNotFound();
        $this->getJson('/api/projects/scheduled-project')->assertNotFound();

        $this->travelTo($publishAt->copy()->addMinute());
        $this->getJson('/api/blog/scheduled-article')->assertOk();
        $this->getJson('/api/services/scheduled-service')->assertOk();
        $this->getJson('/api/projects/scheduled-project')->assertOk();
    }

    public function test_validation_redirects_with_entered_editor_content_preserved(): void
    {
        $this->actingAs(User::factory()->create(['is_admin' => true]));
        $this->from(route('admin.services.create'))->post(route('admin.services.store'), [
            'title_en' => '',
            'short_description_en' => 'Keep this summary after validation.',
            'publish_action' => 'draft',
        ])->assertRedirect(route('admin.services.create'))
            ->assertSessionHasErrors(['title_en'])
            ->assertSessionHasInput('short_description_en', 'Keep this summary after validation.');
    }
}
