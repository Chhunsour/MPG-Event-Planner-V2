<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Models\Project;
use App\Models\QuotationRequest;
use App\Models\Service;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Counts only — real numbers straight out of the tables. No invented
     * trends, no percentage deltas that nothing is actually measuring.
     */
    public function index(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'serviceCount' => Service::count(),
            'servicesPublished' => Service::published()->count(),
            'servicesDraft' => Service::where('is_published', false)->count(),
            'projectCount' => Project::count(),
            'projectsPublished' => Project::published()->count(),
            'projectsDraft' => Project::where('is_published', false)->count(),
            'blogCount' => BlogPost::count(),
            'blogsPublished' => BlogPost::published()->count(),
            'blogsDraft' => BlogPost::where('is_published', false)->count(),
            'newRequests' => QuotationRequest::where('status', 'new')->count(),
            'unreadRequests' => QuotationRequest::where('is_read', false)->count(),
            'recentRequests' => QuotationRequest::query()
                ->latest()
                ->limit(8)
                ->get(),
            'recentServices' => Service::query()->latest('updated_at')->limit(4)->get(),
            'recentProjects' => Project::query()->latest('updated_at')->limit(4)->get(),
            'recentPosts' => BlogPost::query()->latest('updated_at')->limit(4)->get(),
        ]);
    }
}
