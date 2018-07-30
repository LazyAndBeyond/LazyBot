const settings = { //not ready
  'defaultSettings': {
    'prefix': 'b$',
    'nsfw': false,
    'welcomeChannel': 'welcome',
    'welcomeMessage': '{{user}} Just joinned the party!',
    'leaveMessage': 'Oh no {{user}} just left us...',
    'welcomeEnabled': 'false'
  },
    permLevels: [
    { level: 0,
      name: 'User',
      check: () => true
    },

    { level: 2,
      name: 'Mod',
      check: (message) => {
        try {
          if (message.member.permissions.has(['MANAGE_SERVER', 'MANAGE_CHANNELS'])) return true
        } catch (e) {
          return false
        }
      }
    },

    { level: 3,
      name: 'Admin',
      check: (message) => {
        try {
          if (message.member.permissions.has('ADMINISTRATOR')) return true
        } catch (e) {
          return false
        }
      }
    },

    { level: 4,
      name: 'Server Owner',
      check: (message) => message.channel.type === 'text' ? (message.guild.owner.user.id === message.author.id) : false
    },

    { level: 8,
      name: 'Bot Admin',
      check: (message) => message.client.config.admins.includes(message.author.id)
    },

    { level: 10,
      name: 'Bot Owner',
      check: (message) => message.client.config.owner_id === message.author.id
    }
  ]
  
}

module.exports = settings
