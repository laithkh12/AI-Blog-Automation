import { getUserByUsernameDb } from "@/actions/auth";
import UserCard from "@/components/user/UserCard";
import { UserType } from "@/utils/types";

type Params = Promise<{ username: string }>;

export default async function ProfilePage(props: { params: Params }) {
  // Wait for the route parameters to be resolved
  const { username } = await props.params;

  // Fetch the user data using the username
  const user: UserType = await getUserByUsernameDb(username);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 md:mt-0">
        <p className="text-center text-gray-500">User not found.</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen mt-[-100px]">
      <UserCard user={user} />
    </div>
  );
}
