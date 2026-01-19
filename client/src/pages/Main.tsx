import axios from "axios";
import { useEffect, useState } from "react";
import { GeneralFeed } from "../components/GeneralFeed";
import { MainLayout } from "../components/MainLayout";
import { PostInput } from "../components/PostInput";
import { UserFeed } from "../components/UserFeed";
import { useAuthStore } from "../lib/authStore";
import { rootURL } from "../lib/utils";
import { PostType } from "../types";

const shuffleArray = (array: PostType[]) => {
	let currentIndex = array.length,
		randomIndex;
	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex],
			array[currentIndex],
		];
	}
	return array;
};

export const Main = () => {
	const [generalFeedPosts, setGeneralFeedPosts] = useState<PostType[]>([]);
	const [userFeedPosts, setUserFeedPosts] = useState<PostType[]>([]);

	const [isUserFeedLoading, setUserFeedIsLoading] = useState(false);
	const [isGeneralFeedLoading, setGeneralFeedIsLoading] = useState(false);

	const user = useAuthStore((state) => state.user);

	useEffect(() => {
		const getFeeds = async () => {
			setGeneralFeedIsLoading(true);
			setUserFeedIsLoading(true);

			try {
				const [generalResponse, userResponse] = await Promise.all([
					axios.get(`${rootURL}/posts`, { withCredentials: true }),
					axios.get(`${rootURL}/posts/feed`, {
						withCredentials: true,
						headers: { Authorization: `Bearer ${user?.accessToken}` },
					}),
				]);

				const generalPosts = shuffleArray(generalResponse.data);
				console.log({ generalResponse });

				const userPosts = shuffleArray(userResponse.data);

				setGeneralFeedPosts(generalPosts);
				setUserFeedPosts(userPosts);
			} catch (err) {
				console.error("Error", err);
			} finally {
				setGeneralFeedIsLoading(false);
				setUserFeedIsLoading(false);
			}
		};

		getFeeds();
	}, [user?.accessToken]);

	const [activeTab, setActiveTab] = useState("general");

	return (
		<MainLayout classNames="lg:w-1/4">
			<PostInput
				generalFeedPosts={generalFeedPosts}
				userFeedPosts={userFeedPosts}
				setGeneralFeedPosts={setGeneralFeedPosts}
				setUserFeedPosts={setUserFeedPosts}
			/>
			<div className="flex flex-col h-full">
				<div className="flex justify-around border-b">
					<button
						className={`p-4 transition-colors duration-300 ${activeTab === "general" ? "border-b-2 border-blue-500 text-blue-500" : "hover:text-blue-500"}`}
						onClick={() => setActiveTab("general")}
					>
						General Feed
					</button>
					<button
						className={`p-4 transition-colors duration-300 ${activeTab === "user" ? "border-b-2 border-blue-500 text-blue-500" : "hover:text-blue-500"}`}
						onClick={() => setActiveTab("user")}
					>
						Following
					</button>
				</div>
				<div className="p-4 flex-grow">
					{activeTab === "general" && (
						<GeneralFeed
							generalFeedPosts={generalFeedPosts}
							userFeedPosts={userFeedPosts}
							setGeneralFeedPosts={setGeneralFeedPosts}
							setUserFeedPosts={setUserFeedPosts}
							isLoading={isGeneralFeedLoading}
						/>
					)}
					{activeTab === "user" && (
						<UserFeed
							userFeedPosts={userFeedPosts}
							generalFeedPosts={generalFeedPosts}
							setGeneralFeedPosts={setGeneralFeedPosts}
							setUserFeedPosts={setUserFeedPosts}
							isLoading={isUserFeedLoading}
							user={user}
						/>
					)}
				</div>
			</div>
		</MainLayout>
	);
};
