import { createPortal } from "react-dom";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
type UpdatedUserForm= {
  address: string;
  phonenumber: string;
  type: string;
};
type User = {
  id: string;
  email: string;
  address: string;
  phonenumber: string;
  type: string;
};

type Props = {
  user: User;
  onClose: () => void;
};

const schema=yup.object({
    address:yup.string().required("Address is required"),
    phonenumber:yup.string()
  .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
  .required("Phone number is required"),
  type:yup.string().required("Type is required")
})

export default function EditUserModal({ user, onClose }: Props) {
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors,isSubmitting } } =
    useForm<UpdatedUserForm>({ 
      defaultValues:{
      address:user.address,
      phonenumber:user.phonenumber,
      type:user.type,
      },
      resolver:yupResolver(schema),
    });

  const updateMutation = useMutation({
    mutationFn: async (data: UpdatedUserForm) => {
      await axios.put(`https://user-back-y4pl.onrender.com/auth/${user.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onClose();
    },
  });

  const onSubmit = (data: UpdatedUserForm) => {
    updateMutation.mutate({
      ...data,

    });

  };

  return createPortal(
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-100 rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">Edit User</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <input value={user.email} readOnly className="w-full border px-3 py-2 rounded" placeholder="Email" disabled />
          <input {...register("address")} className="w-full border px-3 py-2 rounded" placeholder="Address" />
          <p className="text-ts text-red-500 mt-1">{errors.address?.message}</p>
          <input {...register("phonenumber")} className="w-full border px-3 py-2 rounded" placeholder="Phone Number" maxLength={10} />
          <p className="text-ts text-red-500 mt-1">{errors.phonenumber?.message}</p>
          <select {...register("type")} className="w-full border px-3 py-2 rounded">
            <option value="">Select type</option>
            <option value="vendor">vendor</option>
            <option value="customer">customer</option>
          </select>
          <p className="text-ts text-red-500 mt-1">{errors.type?.message}</p>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-3 py-1 border rounded">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-3 py-1 bg-black text-white rounded disabled:opacity-50">
              {isSubmitting ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
