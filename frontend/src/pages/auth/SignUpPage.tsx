import { Link, useNavigate } from "react-router-dom";
import { ChangeEvent, FormEvent, useState } from "react";

import XSvg from "../../components/svg/xsvg";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import useAuth from "../../hooks/useAuth";
import toast, { LoaderIcon } from "react-hot-toast";
import { PiPassword } from "react-icons/pi";

type FormDataType = {
	email: string;
	username: string;
	fullName: string;
	password: string;
	confirmPassword: string;
}
const SignUpPage = () => {
	const [formData, setFormData] = useState<FormDataType>({
		email: "",
		username: "",
		fullName: "",
		password: "",
		confirmPassword: "",
	});
	const { signup, state } = useAuth();
	const Navigate = useNavigate();

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		await signup(formData.username, formData.fullName, formData.email, formData.password, formData.confirmPassword);
		toast.success('Sign up successfully');
		Navigate('/login')
		setFormData({ email: "", username: "", fullName: "", password: "", confirmPassword: "" });
	};

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const isError = state.error !== null;

	return (
		<div className='max-w-screen-xl mx-auto flex h-screen px-10'>
			<div className='flex-1 hidden lg:flex items-center  justify-center'>
				<XSvg className=' lg:w-2/3 fill-white' />
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col' onSubmit={handleSubmit}>
					<XSvg className='w-24 lg:hidden fill-white' />
					<h1 className='text-4xl font-extrabold text-white'>Join today.</h1>
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdOutlineMail />
						<input
							type='email'
							className='grow'
							placeholder='Email'
							name='email'
							onChange={handleInputChange}
							value={formData.email}
						/>
					</label>
					<div className='flex gap-4 flex-wrap'>
						<label className='input input-bordered rounded flex items-center gap-2 flex-1'>
							<FaUser />
							<input
								type='text'
								className='grow '
								placeholder='Username'
								name='username'
								onChange={handleInputChange}
								value={formData.username}
							/>
						</label>
						<label className='input input-bordered rounded flex items-center gap-2 flex-1'>
							<MdDriveFileRenameOutline />
							<input
								type='text'
								className='grow'
								placeholder='Full Name'
								name='fullName'
								onChange={handleInputChange}
								value={formData.fullName}
							/>
						</label>
					</div>
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdPassword />
						<input
							type='password'
							className='grow'
							placeholder='Password'
							name='password'
							onChange={handleInputChange}
							value={formData.password}
						/>
					</label>
					<label className='input input-bordered rounded flex items-center gap-2'>
						<PiPassword />
						<input
							type='password'
							className='grow'
							placeholder='confirmPassword'
							name='confirmPassword'
							onChange={handleInputChange}
							value={formData.confirmPassword}
						/>
					</label>
					<button className='btn rounded-full btn-primary text-white'>{state.isLoading ? <LoaderIcon className="animate-spin" /> : "Sign up"}</button>
					{isError && <p className='text-red-500 text-sm'>{state.error}</p>}
				</form>
				<div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
					<p className='text-white text-lg'>Already have an account?</p>
					<Link to='/login'>
						<button className='btn rounded-full btn-primary text-white btn-outline w-full'>Login</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default SignUpPage;