'use client'

import {useQuery} from "@tanstack/react-query"
import {todoService} from '../services'

const TodoList = () => {
  const query = useQuery({queryKey: ['todos'], queryFn: todoService.getTodos})

  return (
    <div className="pb-10" data-testid="todo-list">
      {query.data?.map((todo) => (
        <div key={todo.id}
             className="max-w-[600px] mx-auto mt-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-gray-800">{todo.title}</h3>
          {todo.description && (
            <p className="mt-2 text-gray-600">{todo.description}</p>
          )}
        </div>
      ))}
    </div>
  )
}

export default TodoList
