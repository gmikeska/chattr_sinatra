require 'xmpp4r'

module Chattr
	class User
		attr_accessor :socket
		def initialize(username, password, ws)
			@socket = ws

			begin
				@presence = Jabber::Presence.new(nil,nil,nil)
				@JID = Jabber::JID.new(username)
				@client = Jabber::Client.new(@JID)
				@client.connect
				@client.auth(password)
				@client.send(@presence)
				@client.send_with_id Jabber::Iq.new_rosterget() do |data|
					send("load.roster", data)
				end

			rescue Exception => e
				err(e.message)
			end

			log('connected!')


			
		end

		def send(comm, message)
			@socket.send(JSON.generate({command:comm, data:message}))

		end


		def log (msg)
			send("console.log",msg)
		end

		def err (msg)
			send("console.error", msg)
			puts msg
		end

	end

end