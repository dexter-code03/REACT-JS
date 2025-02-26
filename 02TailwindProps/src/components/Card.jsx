import React from 'react'

function Card(props) {
    return (
        console.log(props),
        <div className="max-w-xs p-6 rounded-md shadow-md bg-black">
        <img
          src="https://images.unsplash.com/photo-1696834137457-8872b6c525f4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8MTR8fHxlbnwwfHx8fHw%3D"
          alt=""
          className="object-cover object-center w-full rounded-md h-72 bg-gray-500"
        />
        <div className="mt-6 mb-2">
          <span className="block text-sm font-medium font-mono tracking-widest uppercase text-indigo-400">
            {props.username}
          </span>
          <h2 className="text-xl font-semibold tracking-wide"></h2>
        </div>
        <p className="text-gray-300">
          {props.content}
        </p>
      </div>
    )
}

export default Card
