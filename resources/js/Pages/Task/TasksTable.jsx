import TableHeading from "@/Components/TableHeading.jsx";
import TextInput from "@/Components/TextInput.jsx";
import SelectInput from "@/Components/SelectInput.jsx";
import {TASK_STATUS_CLASS_MAP, TASK_STATUS_TEXT_MAP} from "@/constants.jsx";
import {Link, router} from "@inertiajs/react";
import Pagination from "@/Components/Pagination.jsx";

export default function TasksTable({tasks,success, queryParams = null,hideProjectColumn=false}) {
  queryParams = queryParams || {}
  const searchFieldChanged = (name, value) => {
    if(value){
      queryParams[name] = value
    }else{
      delete queryParams[name]
    }

    router.get(route('task.index'),queryParams)
  }

  const onKeyPress = (name, e) => {
    if(e.key !== 'Enter') {
      return ;
    }
    searchFieldChanged(name, e.target.value)
  }

  const sortChanged = (name) => {
    if(name === queryParams.sort_field){
      if(queryParams.sort_direction === 'asc'){
        queryParams.sort_direction = 'desc'
      }else{
        queryParams.sort_direction = 'asc'
      }
    }else{
      queryParams.sort_field = name
      queryParams.sort_direction = 'asc'
    }
    router.get(route('task.index'),queryParams)
  }

    const deleteTask = (task) => {
        if(!window.confirm('Are you sure you want to delete this task?')){
            return;
        }
        router.delete(route('task.destroy',task.id))
    }

  return(
      <>
        {success && (<div className="bg-emerald-600 py-2 px-4 text-white rounded mb-4">
          {success}
        </div>)} {/*Here we are checking if success is there then we are showing the success message */}

        <div className="overflow-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
            <tr className="text-nowrap">

              {/* WE HAVE SIMPLY MADE COMPONENT OF 'TABLE HEADING' TO REUSE OUR CODE AND GIVE PARAMETERS TO THAT COMPONENT. */}

              <TableHeading
                name = "id"
                sort_field={queryParams.sort_field}
                sort_direction={queryParams.sort_direction}
                sortChanged={sortChanged}
              >
                ID
              </TableHeading>
              <th className="px-3 py-3">Image</th>
              {!hideProjectColumn && (<th className="px-3 py-3">Project Name</th>) }

              <TableHeading
                name = "name"
                sort_field={queryParams.sort_field}
                sort_direction={queryParams.sort_direction}
                sortChanged={sortChanged}
              >
                Name
              </TableHeading>
              <TableHeading
                name = "status"
                sort_field={queryParams.sort_field}
                sort_direction={queryParams.sort_direction}
                sortChanged={sortChanged}
              >
                Status
              </TableHeading>
              <TableHeading
                name = "created_at"
                sort_field={queryParams.sort_field}
                sort_direction={queryParams.sort_direction}
                sortChanged={sortChanged}
              >
                Created Date
              </TableHeading>
              <TableHeading
                name = "due_date"
                sort_field={queryParams.sort_field}
                sort_direction={queryParams.sort_direction}
                sortChanged={sortChanged}
              >
                Due Date
              </TableHeading>
              <th className="px-3 py-3">Created By</th>
              <th className="px-3 py-3 text-center">Actions</th>

            </tr>
            </thead>

            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
            <tr className="text-nowrap">

              <th className="px-3 py-3"></th>
              <th className="px-3 py-3"></th>
              {!hideProjectColumn && <th className="px-3 py-3"></th> }
              <th className="px-3 py-3">
                <TextInput
                  className="w-full"
                  defaultValue={queryParams.name}
                  placeholder="Task Name"
                  onBlur={e => searchFieldChanged('name',e.target.value)}
                  onKeyPress={e => onKeyPress('name',e)}
                />
              </th>
              <th className="px-3 py-3">

                <SelectInput
                  className="w-full "
                  defaultValue={queryParams.status}
                  onChange={ (e) => searchFieldChanged('status', e.target.value)}
                >
                  <option value="">Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </SelectInput>

              </th>

              <th className="px-3 py-3"></th>
              <th className="px-3 py-3"></th>
              <th className="px-3 py-3"></th>
              <th className="px-3 py-3 "></th>

            </tr>
            </thead>
            <tbody>
            {tasks.data.map(task => (
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={task.id}>
                <th className="px-3 py-2">{task.id}</th>
                <td className="px-3 py-2">
                  <img src={task.image_path} alt={task.name} className="w-10 h-10 rounded-full" />
                </td>
                {!hideProjectColumn && (<td className="px-3 py-2">{task.project.name}</td>) }
                <th className="px-3 py-2 text-gray-100 hover:underline">
                  <Link href={route("task.show",task.id)}>{task.name}</Link>
                </th>
                <td className="px-3 py-2 text-nowrap ">
                          <span className={"px-2 py-1 rounded text-nowrap text-white " + TASK_STATUS_CLASS_MAP[task.status] }>
                            {TASK_STATUS_TEXT_MAP[task.status]}
                          </span>
                </td> {/*Here TASK_STATUS_TEXT_MAP is the constant which we have defined in constants.jsx file */}

                <td className="px-3 py-2">{task.created_at}</td>
                <td className="px-3 py-2 text-nowrap">{task.due_date}</td>
                <td className="px-3 py-2 text-nowrap">{task.createdBy.name}</td> {/* Here we know that createdBy is an object defined in UserResource which are getting so here we need only name not complete object */}
                <td className="px-3 py-2 text-nowrap">
                  <Link href={route('task.edit',task.id)} className="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Edit</Link>
                  <button
                      onClick={(e) => deleteTask(task)}
                      className=" hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}


            </tbody>
          </table>
        </div>
        <Pagination links={tasks.meta.links}/>
      </>
  )
}
