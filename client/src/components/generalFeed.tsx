import axios from "axios";
import { useEffect, useState } from "react";
import { rootURL } from "../lib/utils";

export const GeneralFeed = () => {
  const [feedPosts, setFeedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getGeneralFeed = async () => {
      try {
        const response = await axios.get(`${rootURL}/posts`, {
          withCredentials: true,
        });

        const { data } = response;

        setFeedPosts(data);
        console.log(data);

        setIsLoading(false);
      } catch (err) {
        console.error("Error", err);
        setIsLoading(false);
      }
    };

    getGeneralFeed();
  });
  return (
    <>
      <p>General Feed</p>
    </>
  );
};
