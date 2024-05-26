import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {Head, Link, router} from "@inertiajs/react";
import Pagination from "@/Components/Pagination.jsx";
import TextInput from "@/Components/TextInput.jsx";

import { ChevronUpIcon,ChevronDownIcon } from '@heroicons/react/16/solid';
import TableHeading from "@/Components/TableHeading.jsx";


export default function Index({auth,users,queryParams = null,success}){  //We have to accept users from users Controller
  queryParams = queryParams || {}
  const searchFieldChanged = (name, value) => {
      if(value){
        queryParams[name] = value
      }else{
        delete queryParams[name]
      }

      router.get(route('user.index'),queryParams)
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
    router.get(route('user.index'),queryParams)
  }

  const deleteUser = (user) => {
    if(!window.confirm('Are you sure you want to delete this user?')){
      return;
    }
    router.delete(route('user.destroy',user.id))

  }

  return(
    <AuthenticatedLayout
      user={auth.user}
      header={

        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Users
          </h2>
          <Link href={route('user.create')} className= "bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">
            Add New
          </Link>
        </div>

      }
    >
      <Head title="Users" />     {/*This will be the title of the page*/}



      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

          {success && (<div className="bg-emerald-600 py-2 px-4 text-white rounded mb-4">
            {success}
          </div>)}  {/*This will be the success message which we will get after creating the user*/}

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

                    <TableHeading
                      name = "name"
                      sort_field={queryParams.sort_field}
                      sort_direction={queryParams.sort_direction}
                      sortChanged={sortChanged}
                    >
                      Name
                    </TableHeading>
                    <TableHeading
                      name = "email"
                      sort_field={queryParams.sort_field}
                      sort_direction={queryParams.sort_direction}
                      sortChanged={sortChanged}
                    >
                      Email
                    </TableHeading>
                    <TableHeading
                      name = "created_at"
                      sort_field={queryParams.sort_field}
                      sort_direction={queryParams.sort_direction}
                      sortChanged={sortChanged}
                    >
                      Created Date
                    </TableHeading>

                    <th className="px-3 py-3 text-center">Actions</th>

                  </tr>
                  </thead>

                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                  <tr className="text-nowrap">

                    <th className="px-3 py-3"></th>

                    <th className="px-3 py-3">
                      <TextInput
                        className="w-full"
                        defaultValue={queryParams.name}
                        placeholder="User Name"
                        onBlur={e => searchFieldChanged('name',e.target.value)}
                        onKeyPress={e => onKeyPress('name',e)}
                      />
                    </th>
                    <th className="px-3 py-3">

                      <TextInput
                          className="w-full"
                          defaultValue={queryParams.email}
                          placeholder="User Email"
                          onBlur={e => searchFieldChanged('email',e.target.value)}
                          onKeyPress={e => onKeyPress('email',e)}
                      />

                    </th>

                    <th className="px-3 py-3"></th>
                    <th className="px-3 py-3 "></th>

                  </tr>
                  </thead>
                  <tbody>
                  {users.data.map(user => (
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={user.id}>
                      <th className="px-3 py-2">{user.id}</th>

                      <th className="px-3 py-2 text-white text-nowrap">
                          {user.name}
                      </th>

                      <td className="px-3 py-2 text-nowrap ">
                        {user.email}
                      </td>

                      <td className="px-3 py-2">
                        {user.created_at}
                      </td>

                      <td className="px-3 py-2 text-nowrap">
                        <Link
                          href={route('user.edit',user.id)}
                          className="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Edit
                        </Link>

                        <button
                          onClick = {e => deleteUser(user)}
                          className=" hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                          Delete
                        </button>

                      </td>
                    </tr>
                  ))}


                  </tbody>
                </table>
              </div>
              <Pagination links={users.meta.links}/>   {/*This will be the pagination component which we have created in Components folder*/}

            </div>
          </div>
        </div>
      </div>

    </AuthenticatedLayout>
  )
}
