'use client'
import React, {useRef, useState} from "react";
import useSWR from "swr";
import {Session, User} from "@/app/settings/subscriptions/[uuid]/page";
import Link from "next/link";
import LoadingSpinner from "@/components/loading-spinner";
import {useRouter} from "next/navigation";
import {useOnClickOutside} from "usehooks-ts";
import {SalableLogo} from "@/components/salable-logo";
import {LicenseCheckResponse} from "@/app/page";

export const Header = () => {
  const router = useRouter();
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const ref = useRef(null);
  const {data: session, mutate: mutateSession} = useSWR<Session>(`/api/session`)
  const {data: user} = useSWR<User>(`/api/users/${session?.uuid}`)
  const {mutate: mutateLicenseCheck} = useSWR<LicenseCheckResponse>(`/api/licenses/check`)

  const clickOutside = () => {
    setDropDownOpen(false)
  }
  useOnClickOutside(ref, clickOutside)

  return (
    <header className='bg-white'>
      <div className='max-w-[1000px] m-auto py-4 flex justify-between items-center'>
        <Link className='flex items-center' href='/'>
          <div className='w-[30px] mr-2'><SalableLogo/></div>
          <span>Salable Usage Demo</span>
        </Link>
        <div>
          <div className="flex justify-between items-center">
            {session?.uuid && user?.username ? (
              <div ref={ref} className={`relative hover:bg-white ${dropDownOpen && "bg-white rounded-br-none"}`}>
                <div onClick={() => setDropDownOpen(!dropDownOpen)} className='w-[38px] h-[38px] cursor-pointer rounded-full bg-blue-200 leading-none flex items-center justify-center'>
                  <span>{user?.username?.[0].toUpperCase()}</span>
                </div>
                {dropDownOpen && (
                  <div className='absolute flex flex-col right-0 top-[45px] bg-white width-max-content text-right w-[200px] rounded-sm shadow z-10'>
                    <div className='p-3 block f-full border-b text-sm text-center'>Hello, {user.username}</div>
                    <Link className='p-3 block f-full border-b hover:bg-gray-50 text-sm' href={'/settings/subscriptions'} onClick={() => setDropDownOpen(false)}>Subscriptions</Link>
                    <button className='p-3 block f-full text-right hover:bg-gray-50 text-sm' onClick={async () => {
                      try {
                        setLoggingOut(true)
                        await fetch('/api/session', {
                          method: 'DELETE'
                        })
                        await mutateSession()
                        router.push('/sign-in')
                        await mutateLicenseCheck()
                        setLoggingOut(false)
                        setDropDownOpen(false)
                      } catch (e) {
                        console.log(e)
                      }
                    }}>{!loggingOut ? "Sign out" :
                      <div className='w-[15px]'><LoadingSpinner fill="#1e4fd8"/></div>}</button>
                  </div>
                )}
              </div>
            ) : (
              <Link className='p-3 text-white rounded-md leading-none bg-blue-700 w-full text-center text-sm' href="/sign-in">Sign in</Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}