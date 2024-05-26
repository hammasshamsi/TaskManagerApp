<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class TaskResource extends JsonResource
{
    public static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'created_at' => (new Carbon($this->created_at))->format('Y-m-d'),
            'due_date' => (new Carbon($this->due_date))->format('Y-m-d'),
            'status' => $this->status,
            'priority' => $this->priority,
            'image_path' => $this->image_path ? Storage::url($this->image_path) : '',
            'project_id' => $this->project_id,
            'project' => new ProjectResource($this->project),  // If we Simply pass $this->project this will return all field of project which is not logical and good practice, so we use resource to define what to pass and display
            'assigned_user_id' => $this->assigned_user_id,
            'assignedUser' => $this->assignedUser ? new UserResource($this->assignedUser) : null,  // If we Simply pass $this->assignedUser this will return all field of user which is not logical and good practice, so we use resource to define what to pass and display
            'createdBy' => new UserResource($this->createdBy),  // If we Simply pass $this->createdBy this will return all field of user which is not logical and good practice, so we use resource to define what to pass and display to front-end
            'updatedBy' => new UserResource($this->updatedBy)   // If we Simply pass $this->updatedBy this will return all field of user which is not logical and good practice, so we use resource to define what to pass and display
        ];
    }
}
