import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";
import axios from "axios";

export default function Index() {
  const router = useRouter();
  const { address } = useAccount();
  const [groups, setGroups] = useState<any>();
  const [groupDataLoading, setGroupDataLoading] = useState<boolean>(true);

  // Get expenses from the graph
  useEffect(() => {
    if (router.isReady) {
      const apiUrl =
        "https://api.studio.thegraph.com/query/55648/celosplit/0.01"; // Replace with your GraphQL API URL
      const query = `
      {
        groupCreateds( 
          where : {
            or : [
              {owner : "${address}"},
              { members_contains : ["${address}"]}
            ]
          }
        ) {
          blockNumber
          blockTimestamp
          description
          groupId
          groupImage
          groupName
          members
          owner
        }
      }
      `;
      const headers = {
        "Content-Type": "application/json",
        // Add any necessary authentication headers if required
      };
      axios.post(apiUrl, { query }, { headers }).then((res) => {
        console.log(res.data.data.groupCreateds);

        if (res.data.data.groupCreateds.length > 0) {
          setGroups(res.data.data.groupCreateds);
          setGroupDataLoading(false);
        }
      });
    }
  }, [router.isReady]);

  return (
    <>
      <Head>
        <title>CeloSplit</title>
        <meta name="title" content="CeloSplit" />
      </Head>
      <div className="my-5 text-2xl font-black">Groups</div>
      {/* Groups start */}
      {!groupDataLoading && (
        <div>
          <div className="mt-3 divide-y divide-gray-200">
            {groups?.map((group: any, index: number) => (
              <div
                key={index}
                className="py-3.5 flex items-center justify-between"
              >
                <Link
                  href={`/group/${parseInt(group.groupId)}`}
                  className="flex items-center"
                >
                  <div className="shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="inline-block h-14 w-14 rounded-full ring-2 ring-gray-300"
                      // src={`https://cloudflare-ipfs.com/ipfs/${group.groupImage}`}
                      src={`https://gateway.lighthouse.storage/ipfs/${group.groupImage}`}
                      alt=""
                    />
                  </div>
                  <div className="ml-5">
                    <p className="text-xl font-bold text-gray-900 leading-none">
                      {group.groupName}
                    </p>
                    <p className="mt-2 text-base font-medium text-gray-500 leading-none line-clamp-2">
                      {group.description}
                    </p>
                  </div>
                </Link>
                {/* <div className="text-sm text-gray-200 font-bold">
              {group.amount} ETH
            </div> */}
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Groups end */}
    </>
  );
}
