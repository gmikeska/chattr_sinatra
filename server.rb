	require 'sinatra'
require 'sinatra/reloader'
require 'sinatra-websocket'
require 'json'
require_relative 'repos/xmpp'
set :server, 'thin'
set :sockets, []

module Chattr
	class Server < Sinatra::Application

		get '/' do
		  if !request.websocket?
		    erb :index
		  else

		    request.websocket do |ws|
		      ws.onopen do
		        settings.sockets << ws
		      end

		      ws.onmessage do |msg|
		      	@message = JSON.parse(msg)
		      	case @message['eventName']
				when "login"
				  @client = Chattr::User.new(@message['username'], @message['password'], ws)
				  ws.send(JSON.generate({eventName: "console.log", data: "logging in"}))
				when "logout"
				  puts 'logout'
				when 'msg'
					@client.chat_message(@message['user'], @message['message'])
				when "echo"
					message = {eventName: "recieve", data: @message['data']}
					ws.send(JSON.generate(message))
				else
				  puts @message['eventName']
				end
		      	
		      end

		      ws.onclose do
		        warn("websocket closed")
		        settings.sockets.delete(ws)
		      end

		    end #request.websocket do
		  end #else
		end #get
	end #class
end #module

__END__