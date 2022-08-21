import { useRouter } from 'next/router';
import Head from 'next/head';

const CustomSlugPage = () => {
  const router = useRouter();
  console.log('router: ', router);

  const { slug } = router?.query;
  console.log('slug: ', slug);

  return (
    <>
      <Head>
        <title>{slug}</title>
      </Head>
      <div>Page {slug}</div>
    </>
  );
};

export default CustomSlugPage;
