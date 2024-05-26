import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {Head, Link, router} from "@inertiajs/react";
import Pagination from "@/Components/Pagination.jsx";
import {PROJECT_STATUS_TEXT_MAP,PROJECT_STATUS_CLASS_MAP} from "@/constants.jsx";
import TextInput from "@/Components/TextInput.jsx";
import SelectInput from "@/Components/SelectInput.jsx";
import { ChevronUpIcon,ChevronDownIcon } from '@heroicons/react/16/solid';
import TableHeading from "@/Components/TableHeading.jsx";


export default function Index({auth,projects,queryParams = null,success}){  //We have to accept projects from projects Controller
  queryParams = queryParams || {}
  const searchFieldChanged = (name, value) => {
      if(value){
        queryParams[name] = value
      }else{
        delete queryParams[name]
      }

      router.get(route('project.index'),queryParams)
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
    router.get(route('project.index'),queryParams)
  }

  const deleteProject = (project) => {
    if(!window.confirm('Are you sure you want to delete this project?')){
      return;
    }
    router.delete(route('project.destroy',project.id))

  }

  return(
    <AuthenticatedLayout
      user={auth.user}
      header={

        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Projects
          </h2>
          <Link href={route('project.create')} className= "bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">
            Add New
          </Link>
        </div>

      }
    >
      <Head title="Projects" />     {/*This will be the title of the page*/}



      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

          {success && (<div className="bg-emerald-600 py-2 px-4 text-white rounded mb-4">
            {success}
          </div>)}  {/*This will be the success message which we will get after creating the project*/}

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">

              <div className="overflow-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                  <tr className="text-nowrap">

                    {/*WE HAVE SIMPLY MADE COMPONENT OF 'TABLE HEADING' TO REUSE OUR CODE AND GIVE PARAMETERS TO THAT COMPONENT.   */}

                    <TableHeading
                        name = "id"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                      ID
                    </TableHeading>
                    <th className="px-3 py-3">Image</th>
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

                    <th className="px-3 py-3">
                      <TextInput
                        className="w-full"
                        defaultValue={queryParams.name}
                        placeholder="Project Name"
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
                  {projects.data.map(project => (
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={project.id}>
                      <th className="px-3 py-2">{project.id}</th>
                      <td className="px-3 py-2">
                        <img src={project.image_path} alt={project.name} className="w-10 h-10 rounded-full" />
                      </td>
                      <th className="px-3 py-2 text-white text-nowrap hover:underline">
                        <Link href={route("project.show",project.id)}>
                          {project.name}
                        </Link>
                      </th>

                      <td className="px-3 py-2 text-nowrap ">
                          <span className={"px-2 py-1 rounded text-white " + PROJECT_STATUS_CLASS_MAP[project.status] }>
                            {PROJECT_STATUS_TEXT_MAP[project.status]}
                          </span>
                      </td> {/*Here PROJECT_STATUS_TEXT_MAP is the constant which we have defined in constants.jsx file */}

                      <td className="px-3 py-2">{project.created_at}</td>
                      <td className="px-3 py-2 text-nowrap">{project.due_date}</td>
                      <td className="px-3 py-2 text-nowrap">{project.createdBy.name}</td> {/* Here we know that createdBy is an object defined in UserResource which are getting so here we need only name not complete object */}
                      <td className="px-3 py-2 text-nowrap">
                        <Link
                          href={route('project.edit',project.id)}
                          className="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Edit
                        </Link>

                        <button
                          onClick = {e => deleteProject(project)}
                          className=" hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                          Delete
                        </button>

                      </td>
                    </tr>
                  ))}


                  </tbody>
                </table>
              </div>
              <Pagination links={projects.meta.links}/>   {/*This will be the pagination component which we have created in Components folder*/}

            </div>
          </div>
        </div>
      </div>

    </AuthenticatedLayout>
  )
}
