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
				log('before start')
				@client.send(@presence)
				@roster = @client.send(Jabber::Iq.new_rosterget())
				@roster = Jabber::Roster::IqQueryRoster.receive_iq(@roster)
				log(@roster)
				log('after start')

			rescue Exception => e
				err(e.message)
			end

			log('connected!')


			
		end



		def log (msg)
			@socket.send(JSON.generate({command:"recieve", data:msg}))
		end

		def err (msg)
			@socket.send(JSON.generate({command:"error", data:msg}))
			puts msg
		end
	end

end