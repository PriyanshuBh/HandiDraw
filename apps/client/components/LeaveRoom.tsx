import { useAuthStore } from '../stores/authStore/authStore'
import { LogOut } from 'lucide-react'
import React from 'react'
import LeaveRoomModal from './LeaveRoomModal'

interface LeaveRoomProps {
  socket: WebSocket;
  roomId: string;
}

const LeaveRoom = ({socket, roomId}: LeaveRoomProps) => {
  const { isModalVisible, changeModalVisibility} = useAuthStore()
  
  const leaveRoomHandler = () => {  
      changeModalVisibility()
  }   

  return (
    <>  
      <button 
        onClick={leaveRoomHandler} 
        title="Leave Room"
        className='fixed top-4 right-4 z-50 group p-2.5 rounded-xl bg-zinc-900/90 backdrop-blur-md border border-zinc-800 text-red-600 hover:text-white hover:bg-red-600 hover:border-red-500 transition-all duration-200 shadow-lg shadow-black/20'
      >
          <LogOut className='size-5 transition-transform group-hover:-translate-x-0.5' />
      </button>
      
      {isModalVisible && (
        <LeaveRoomModal socket={socket} roomId={roomId} />
      )}
    </>
  )
}

export default LeaveRoom