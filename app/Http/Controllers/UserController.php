<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserCrudResource;
use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;


class UserController extends Controller
{
    public function index()
    {
        $query = User::query();

        $sortField = request('sort_field','created_at');
        $sortDirection = request('sort_direction','desc');

        if (request('name')) {
            $query->where('name', 'LIKE', '%'.request('name').'%');
        }
        if (request('email')) {
            $query->where('email', 'LIKE', '%'.request('email').'%');
        }


        $users = $query->orderBy($sortField,$sortDirection)->paginate(10)->onEachSide(1);
        return inertia('User/Index', [
            // UserCrudResource is different and UserResource is different. UserCrudResource is used for CRUD operations and UserResource is used for normal operations.
            'users' => UserCrudResource::collection($users),  //This users will pass to user/index.jsx which we commented out in that file
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('User/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $data = $request->validated();  //This will get the validated data from StoreUserRequest with we defined rules there
        $data['email_verified_at'] = time(); //This will update the email_verified_at field with current time
        $data['password'] = bcrypt($data['password']);
        User::create($data);
        return to_route('user.index')->with('success', 'User created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        return inertia('User/Edit', [
            'user' => new UserCrudResource($user),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $data = $request->validated(); //This will get the validated data from UpdateUserRequest with we defined rules there
        $password = bcrypt($data['password']) ?? null ;
        if($password){
            $data['password'] = bcrypt($password);
        }else{
            unset($data['password']);
        }
        $user -> update($data);
        $name = $user->name; // User name
        return to_route('user.index')->with('success', "User \"$name\" updated successfully");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $name = $user->name; // Project name
        $user -> delete();
        return to_route('user.index')->with('success', "User \"$name\" deleted successfully");
    }
}
