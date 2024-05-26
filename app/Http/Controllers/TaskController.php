<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProjectResource;
use App\Http\Resources\TaskResource;
use App\Http\Resources\UserResource;
use App\Models\Project;
use App\Models\Task;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Task::query();
        $sortField = request('sort_field','created_at');
        $sortDirection = request('sort_direction','desc');

        if (request('name')) {
            $query->where('name', 'LIKE', '%'.request('name').'%');
        }
        if(request('status')) {
            $query->where('status', request('status'));
        }

        $tasks = $query->orderBy($sortField,$sortDirection)->paginate(10)->onEachSide(1);
        return inertia('Task/Index', [
            'tasks' => TaskResource::collection($tasks),  //This tasks will pass to task/index.jsx which we commented out in that file
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $projects = Project::query()->orderBy('name','asc')->get();
        $users = User::query()->orderBy('name' , 'asc')->get();
        return inertia('Task/Create',[
            'projects' => ProjectResource::collection($projects),  // This will pass to task/create.jsx
            'users' => UserResource::collection($users)
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        $data = $request->validated();  //This will get the validated data from StoreTaskRequest with we defined rules there
        /** @var $image \Illuminate\Http\UploadedFile*/
        $image = $data['image'] ?? null;
        $data['created_by'] = Auth::id();  //This will get the authenticated user id
        $data['updated_by'] = Auth::id();
        if($image){
            $data['image_path'] = $image->store('task/'.Str::random(), 'public'); //This will return the image path with random name and then store in public folder and link to $data['image_path'] (in database)
        }
        Task::create($data);
        return to_route('task.index')->with('success', 'Task created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {

        return inertia('Task/Show', [
            'task' => new TaskResource($task),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
    {
        $projects = Project::query()->orderBy('name','asc')->get();
        $users = User::query()->orderBy('name' , 'asc')->get();
        return inertia('Task/Edit', [
            'task' => new TaskResource($task),
            'projects' => ProjectResource::collection($projects),
            'users' => UserResource::collection($users)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        $data = $request->validated(); //This will get the validated data from UpdateTaskRequest with we defined rules there
        $image = $data['image'] ?? null;
        $data['updated_by'] = Auth::id();  //This will get the authenticated user id
        if($image){

            // In this Request If image is updated then delete the old image from public folder
            if($task->image_path) {
                Storage::disk('public')->deleteDirectory(dirname($task->image_path)); //This will delete the old image from public folder
            }
            $data['image_path'] = $image->store('task/'.Str::random(), 'public'); //This will return the image path with random name and then store in public folder and link to $data['image_path'] (in database)
        }

        $task -> update($data);
        $name = $task->name; // Task name
        return to_route('task.index')->with('success', "Task \"$name\" updated successfully");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $name = $task->name; // Task name
        $task -> delete();
        if($task->image_path) {
            Storage::disk('public')->deleteDirectory(dirname($task->image_path)); //This will delete the image from public folder
        }
        return to_route('task.index')->with('success', "Task \"$name\" deleted successfully");
    }

    public function myTasks(){
        $user = Auth::user();
        $query = Task::query()->where('assigned_user_id', $user->id);
        $sortField = request('sort_field','created_at');
        $sortDirection = request('sort_direction','desc');

        if (request('name')) {
            $query->where('name', 'LIKE', '%'.request('name').'%');
        }
        if(request('status')) {
            $query->where('status', request('status'));
        }

        $tasks = $query->orderBy($sortField,$sortDirection)->paginate(10)->onEachSide(1);
        return inertia('Task/Index', [
            'tasks' => TaskResource::collection($tasks),  //This tasks will pass to task/index.jsx which we commented out in that file
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }

}
