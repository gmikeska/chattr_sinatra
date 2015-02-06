require 'xmpp4r'
require 'xmpp4r/bytestreams/helper/filetransfer'
require 'xmpp4r/roster/helper/roster'
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
				@pending = []
				@client.auth(password)
				@rosterManager = Jabber::Roster::Helper.new(@connection)
				
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
					rosterInit()
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
		def rosterInit()
			@rosterManager = Jabber::Roster::Helper.new(@connection)
			
			@rosterManager.add_subscription_request_callback do |item, presence|
					send('console.log', item)
			end
		end
		def add(name)
			jid = Jabber::JID.new(name)
			@rosterManager.add(jid, nil, true)
		end
		def accept(name)
			@rosterManager.accept_subscription(name)
		end
		def accept_add(name)
			accept(name)
			add(name)
		end
		def decline(name)
			@rosterManager.decline_subscription(name)
		end
		def log (msg)
			send("console.log", msg)
		end
		def disconnect
			@connection.close!()
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

		def chat_status(user, state)
			p "#{user} - #{state}"
			m = Jabber::Message.new(user)
			m.chat_state=state
			m.type=:chat
			@client.send(m)
		end
	end

end