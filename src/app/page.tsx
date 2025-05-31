import { redirect } from 'next/navigation';
import Image from "next/image";

export default function Home() {
  redirect('/login');
  
  // This code will not run due to the redirect
  return null;
}
