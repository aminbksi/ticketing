import { useEffect } from "react";
import Router from "next/router";
import useRequest from "../../hooks/useRequest";

const Signout = () => {
  const { request } = useRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSuccess: () => Router.push("/"),
  });

  useEffect(() => {
    request();
  }, []);

  return <div>Signing out...</div>;
};

export default Signout;
