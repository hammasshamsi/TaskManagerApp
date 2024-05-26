<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProjectResource;
use App\Http\Resources\TaskResource;
use App\Models\Project;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProjectController extends Controller
{

    public function index()
    {
        $query = Project::query();

        $sortField = request('sort_field','created_at');
        $sortDirection = request('sort_direction','desc');

        if (request('name')) {
            $query->where('name', 'LIKE', '%'.request('name').'%');
        }
        if(request('status')) {
            $query->where('status', request('status'));
        }

        $projects = $query->orderBy($sortField,$sortDirection)->paginate(10)->onEachSide(1);
        return inertia('Project/Index', [
            'projects' => ProjectResource::collection($projects),  //This projects will pass to project/index.jsx which we commented out in that file
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }


    public function create()
    {
        return inertia('Project/Create');
    }


    public function store(StoreProjectRequest $request)
    {
        $data = $request->validated();  //This will get the validated data from StoreProjectRequest with we defined rules there
        /** @var $image \Illuminate\Http\UploadedFile*/
        $image = $data['image'] ?? null;
        $data['created_by'] = Auth::id();  //This will get the authenticated user id
        $data['updated_by'] = Auth::id();
        if($image){
            $data['image_path'] = $image->store('project/'.Str::random(), 'public'); //This will return the image path with random name and then store in public folder and link to $data['image_path'] (in database)
        }
        Project::create($data);
        return to_route('project.index')->with('success', 'Project created successfully');
    }

    public function show(Project $project)
    {
        $query = $project->tasks();
        $sortField = request('sort_field','created_at');
        $sortDirection = request('sort_direction','desc');

        if (request('name')) {
            $query->where('name', 'LIKE', '%'.request('name').'%');
        }
        if(request('status')) {
            $query->where('status', request('status'));
        }
        $task = $query->orderBy($sortField,$sortDirection)->paginate(10)->onEachSide(1);

        return inertia('Project/Show', [
            'project' => new ProjectResource($project),
            'tasks' => TaskResource::collection($task),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }


    public function edit(Project $project)
    {
        return inertia('Project/Edit', [
            'project' => new ProjectResource($project),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, Project $project)
    {
        $data = $request->validated(); //This will get the validated data from UpdateProjectRequest with we defined rules there
        $image = $data['image'] ?? null;
        $data['updated_by'] = Auth::id();  //This will get the authenticated user id
        if($image){

            // In this Request If image is updated then delete the old image from public folder
            if($project->image_path) {
                Storage::disk('public')->deleteDirectory(dirname($project->image_path)); //This will delete the old image from public folder
            }
            $data['image_path'] = $image->store('project/'.Str::random(), 'public'); //This will return the image path with random name and then store in public folder and link to $data['image_path'] (in database)
        }

        $project -> update($data);
        $name = $project->name; // Project name
        return to_route('project.index')->with('success', "Project \"$name\" updated successfully");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        $name = $project->name; // Project name
        $project -> delete();
        if($project->image_path) {
            Storage::disk('public')->deleteDirectory(dirname($project->image_path)); //This will delete the image from public folder
        }
        return to_route('project.index')->with('success', "Project \"$name\" deleted successfully");
    }
}
