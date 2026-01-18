import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable
}
    from "@tanstack/react-table"
import { useState } from "react";

import EditUserModal from "./EditUser";

type User = {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    address: string;
    phonenumber: string;
    type: string;
}


const columnHelper = createColumnHelper<User>();

function ListUser() {
    const [globalFilter, setGloablFilter] = useState("");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleEdit = (user: User) => {
        setSelectedUser(user);
    }
    const { data, isLoading, isError } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axios.get('https://user-back-y4pl.onrender.com/auth/')
            return res.data;
        }
    })
    const queryClient = useQueryClient();

    const deleteUserMutation = useMutation({
        mutationFn: async (id: string) => {
            await axios.delete(`https://user-back-y4pl.onrender.com/auth/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] })
        }
    })

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this user?")) {
            deleteUserMutation.mutate(id);
        }
    }
    const columns = [
        columnHelper.accessor("firstname", {
            header: "First Name",
        }),
        columnHelper.accessor("lastname", {
            header: "Last Name",
        }), columnHelper.accessor("email", {
            header: "Email",
        }), columnHelper.accessor("address", {
            header: "Address",
        }), columnHelper.accessor("phonenumber", {
            header: "Phone Number",
        }), columnHelper.accessor("type", {
            header: "Type",
        }),
        columnHelper.display({
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <div className="flex gap-2 justify-center">
                        <button
                            onClick={() => handleEdit(user)}
                            className="px-2 py-1 text-white bg-blue-500 rounded"
                        >
                            Edit
                        </button>

                        <button
                            onClick={() => handleDelete(user.id)}
                            className="px-2 py-1 text-white bg-red-500 rounded"
                        >
                            Delete
                        </button>
                    </div>
                )
            }
        })
    ]

    const table = useReactTable({
        data: data?.data || [],
        columns,
        state: {
            globalFilter,
        },
        initialState: {
            pagination: {
                pageSize: 5,
            }
        },
        onGlobalFilterChange: setGloablFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),

    })
    if (isLoading) return <p>Loading...</p>
    if (isError) return <p>Error loading users</p>

    return (
        <div className="min-h-screen bg-gray-300">
        <div className="p-6 space-y-4">
            <input type="text"
                placeholder="Search users..."
                value={globalFilter ?? ""}
                onChange={(e) => setGloablFilter(e.target.value)
                }
                className="border px-3 py-2 rounded w-64"
            />
            <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full border-collapse">
                    <thead className="bg-gray-100">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} className="px-4 py-2 text-center align-middle text-sm font-semibold">
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id} className="border-t">
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className="px-4 py-2 text-center align-middle text-sm">
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
            <div className="flex items-center justify-between mt-4">
                <div className="space-x-2">
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Previous
                    </button>

                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>

                <span>
                    Page{" "}
                    <strong>
                        {table.getState().pagination.pageIndex + 1} of{" "}
                        {table.getPageCount()}
                    </strong>
                </span>
            </div>
            {selectedUser && (
                <EditUserModal
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                />
            )}
        </div>
        </div>
    )
}

export default ListUser;