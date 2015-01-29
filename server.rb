require 'sinatra'
require 'sinatra/reloader'
require 'sinatra-websocket'
require 'json'
require_relative 'repos/xmpp'
set :server, 'thin'
set :sockets, []


module Chattr
	class Server < Sinatra::Application

		set :bind, '0.0.0.0'

		get '/' do
		  if !request.websocket?
		    erb :index
		  else

		    request.websocket do |ws|
		      ws.onopen do
		        ws.send("Hello World!")
		        settings.sockets << ws
		      end

		      ws.onmessage do |msg|
		      	@message = JSON.parse(msg)
		      	case @message['command']
				when "login"
				  @client = Chattr::User.new(@message['username'], @message['password'], ws)
				when "logout"
				  puts 'logout'
				when "echo"
					message = {command: "recieve", data: @message['data']}
					ws.send(JSON.generate(message))
				else
				  puts "default case"
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