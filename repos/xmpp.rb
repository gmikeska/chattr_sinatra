require 'xmpp4r'
require 'xmpp4r/bytestreams/helper/filetransfer'
#same code?
module Chattr
	class User
		attr_accessor :socket
		def initialize(username, password, ws)
			@socket = ws

			begin
				@presence = Jabber::Presence.new(nil,nil,nil)
				@JID = Jabber::JID.new(username)
				@client = Jabber::Client.new(@JID)
				@connection = @client.connect
				@client.auth(password)
				
				@connection.presence_callbacks.add do |data|
					send('presence', data)
				end
				@ft = Jabber::FileTransfer::Helper.new(@connection)
				@ft.add_incoming_callback do |iq,file|
					send("console.log","Incoming file transfer from #{iq.from}: #{file.fname} (#{file.size / 1024} KB)")
					p "Incoming file transfer from #{iq.from}: #{file.fname} (#{file.size / 1024} KB)"
				end
				p 

				@connection.message_callbacks.add do |data|
					send('msg', data)
				end
				@connection.stanza_callbacks.add do |data|
					send('console.log', data)
				end
				@client.send(@presence)
				@client.send_with_id Jabber::Iq.new_rosterget() do |data|
					send("load.roster", data)
				end

			rescue Exception => e
				err(e.message)
				send("auth.error", e.message)
			end
		
		end

		def send(comm, message)
			@socket.send(JSON.generate({eventName:comm, data:message}))

		end


		def log (msg)
			send("console.log", msg)
		end

		def err (msg)
			send("auth.error", msg)
			puts msg
		end

		def chat_message(user, msg)
			m = Jabber::Message.new(user, msg)
			m.type=:chat
			@client.send(m)
		end
	end

end