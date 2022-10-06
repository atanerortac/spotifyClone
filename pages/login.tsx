import { getProviders, signIn } from "next-auth/react";
import { AppProps } from "next/app";
import { LOGIN_URL } from "../lib/spotify";

interface Props {
  providers: AppProps;
}
const Login = ({ providers }: Props) => {
  return (
    <div className="flex flex-col items-center bg-black min-h-screen w-full justify-center">
      <img
        className="w-52 mb-5"
        src="https://links.papareact.com/9xl"
        alt="spoIcon"
      />
      {Object.values(providers).map((provider: any) => (
        <div key={provider.name}>
          <button
            onClick={() => signIn(provider.id, { callbackUrl: "/" })}
            className="bg-[#18D868] text-white p-5 rounded-lg"
          >
            Login With {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Login;

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: {
      providers,
    },
  };
}
