import React from "react";
import Messages from "./Message";
import ChatInput from "./chat/ChatInput";

const ChatWrapper = () => {
  return (
    <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
      <div className="flex-1 justify-between flex flex-col mb-28">
        <Messages />
      </div>

      <ChatInput />
    </div>
  );
};

export default ChatWrapper;
