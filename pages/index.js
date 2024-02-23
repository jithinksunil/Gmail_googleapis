import SEO from '../components/SEO';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useEmailStore, useTokenStore } from '../store/token';
import { supabase } from '../utils/supabase';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  const setAccessToken = useTokenStore((state) => state.setAccessToken);
  const [image, setImage] = useState('');
  // const [message,setMessage]=useState('')
  const setEmail = useEmailStore((state) => state.setEmail);
  const [loading, setLoading] = useState(false);

  const handleAccess = async (e) => {
    setLoading(true);
    const res = await fetch('/api/auth').then((res) => res.json());
    router.push(res.url);
  };

  const handleTokens = useCallback(
    async (code) => {
      setLoading(true);

      const tokens = await fetch('/api/tokens', {
        method: 'POST',
        body: JSON.stringify({ code }),
        headers: { 'Content-Type': 'application/json' },
      }).then((res) => res.json());
      console.log(tokens.message);
      // if(tokens?.message){
      //   setMessage(tokens.message)
      // }
      if (tokens?.image) {
        setImage(tokens.image);
      }

      localStorage.setItem('accessToken', tokens.tokens.access_token);
      localStorage.setItem('refreshToken', tokens.tokens.refresh_token);
      localStorage.setItem('clientEmail', tokens.email);
      setAccessToken({ ...tokens.tokens });
      setEmail({ email: tokens.email });

      setLoading(false);
      toast.success('Gmail account connected successfully');
      if (tokens.image == 'noAttachmentInLastEmail') {
        toast.error('No attachments');
        setImage('');
      }
      // router.push(`/email`);
    },
    [router, setAccessToken]
  );

  useEffect(() => {
    if (router.query.code) {
      handleTokens(router.query.code);
    }
  }, [router, handleTokens]);

  return (
    <>
      <SEO />
      <h1 className='app_name'>Email Trigger</h1>
      {loading ? (
        <Loader />
      ) : (
        <button onClick={handleAccess} className='access'>
          Give Access
        </button>
      )}
      {/* {
        message?<p style={{color:'white'}}>{message}</p>:null
      } */}
      {image && image !== 'noAttachmentInLastEmail' ? (
        <Image
          src={`/attachmentsDownloaded/${image}`}
          alt=''
          width={500}
          height={500}
        />
      ) : null}
    </>
  );
}
