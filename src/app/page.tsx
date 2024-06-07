"use client"

import { useEffect, useRef, useState } from "react";

type APIReponse = {
	data: Array<{ id: number, name: string, city: string, state: string, license_number: string, is_license_active: boolean }>,
	cursor: number | null,
	has_more: boolean
}

enum QueryParams {
	name = 'name',
	city = 'city',
	state = 'state',
	cursor = 'cursor'
}

type SearchType = {
	[key in QueryParams]?: string;
}

async function getData(q: SearchType) {
	console.log("Called")
	const q_params = new URLSearchParams(q).toString()
	let url = 'http://3.111.55.68/api/search'
	if (q_params) url += `?${q_params}`
	const response = await fetch(url);
	if (response.status !== 200) return null

	return response.json()
}

export default function Home() {
	const selectRef = useRef<HTMLSelectElement>(null)
	const [searchParams, setSearchParams] = useState<SearchType>({})
	const [data, setData] = useState<APIReponse>({ data: [], cursor: null, has_more: false })

	useEffect(() => {
		let timeout = setTimeout(() => getData(searchParams).then(setData), 50)
		return () => {
			if (timeout) clearTimeout(timeout)
		}
	}, [searchParams])


	return (
		<main className="flex min-h-screen flex-col items-center pt-16 pb-24 px-24">
			<div className="flex gap-2 w-full items-center">
				<div className="py-1 px-2 rounded-md bg-gray-800">
					<select
						ref={selectRef}
						onChange={e => {
							if (Object.keys(searchParams).length) {
								setSearchParams(p => ({ [e.target.value]: p[Object.keys(searchParams)[0] as keyof SearchType] }))
							}
						}}
						name="search-param"
						className="bg-gray-800 pr-3 outline-none"
					>
						<option value="name">Name</option>
						<option value="city">City</option>
						<option value="state">State</option>
					</select>
				</div>
				<p>:</p>
				<input
					onChange={e => {
						setSearchParams({ [selectRef.current!.value]: e.target.value })
					}}
					placeholder="Search..."
					className="py-1 px-2 rounded-md bg-gray-800"
				/>
			</div>
			<br />
			<table className="w-full border-spacing-0 border-separate rounded-xl border border-gray-800 overflow-hidden">
				<thead>
					<tr>
						<td className="border-r border-gray-800 border-b pl-3 py-2">#</td>
						<td className="border-r border-gray-800 border-b pl-3 py-2">License number</td>
						<td className="border-r border-gray-800 border-b pl-3 py-2">Name</td>
						<td className="border-r border-gray-800 border-b pl-3 py-2">City</td>
						<td className="border-r border-gray-800 border-b pl-3 py-2">State</td>
						<td className="border-b border-gray-800 pl-3 py-2">Status</td>
					</tr>
				</thead>
				<tbody>
					{data.data.map((d, i) => (
						<tr key={i}>
							<td className="border-r border-gray-800 border-b pl-3 py-1">{i + 1}.</td>
							<td className="border-r border-gray-800 border-b pl-3 py-1">{d.license_number}</td>
							<td className="border-r border-gray-800 border-b pl-3 py-1">{d.name}</td>
							<td className="border-r border-gray-800 border-b pl-3 py-1">{d.city}</td>
							<td className="border-r border-gray-800 border-b pl-3 py-1">{d.state ?? "-"}</td>
							<td className="border-b border-gray-800 pl-3 py-1">{d.is_license_active ? "Active" : "Inactive"}</td>
						</tr>
					))}
				</tbody>
			</table>
		</main>
	);
}
