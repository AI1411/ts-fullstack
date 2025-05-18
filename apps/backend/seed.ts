import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import { faker } from '@faker-js/faker';
import {
  teamsTable,
  usersTable,
  todosTable,
  tasksTable,
  notificationsTable,
  subTasksTable,
  chatsTable,
  chatMessagesTable,
  productsTable,
  ordersTable,
  orderItemsTable,
  categoriesTable,
  companiesTable,
  countriesTable,
  inquiriesTable,
  invoicesTable,
  contactsTable,
  baseballPlayersTable,
  baseballGameStatsTable,
  baseballGamesTable,
  baseballTeamsTable
} from './src/db/schema';

// Load environment variables
config({ path: '.dev.vars' });

// Database connection
const client = postgres(process.env.DATABASE_URL!, { prepare: false });
const db = drizzle({ client });

// Helper function to generate random number within range
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Seed function
async function seed() {
  console.log('🌱 Starting database seeding...');

  try {
    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('Clearing existing data...');
    await db.delete(orderItemsTable);
    await db.delete(invoicesTable);
    await db.delete(ordersTable);
    await db.delete(productsTable);
    await db.delete(categoriesTable);
    await db.delete(chatMessagesTable);
    await db.delete(chatsTable);
    await db.delete(subTasksTable);
    await db.delete(notificationsTable);
    await db.delete(tasksTable);
    await db.delete(todosTable);
    await db.delete(inquiriesTable);
    await db.delete(contactsTable);
    await db.delete(usersTable);
    await db.delete(teamsTable);
    await db.delete(countriesTable);
    await db.delete(baseballGameStatsTable);
    await db.delete(baseballGamesTable);
    await db.delete(baseballTeamsTable);
    await db.delete(baseballPlayersTable);

    // Skip deleting from companies table as it might not exist yet
    // The table will be created when migrations are applied
    // await db.delete(companiesTable);

    // Seed teams
    console.log('Seeding teams...');
    const teamIds = [];
    for (let i = 0; i < 5; i++) {
      const [team] = await db.insert(teamsTable).values({
        name: faker.company.name(),
        description: faker.company.catchPhrase(),
      }).returning({ id: teamsTable.id });
      teamIds.push(team.id);
    }

    // Seed users
    console.log('Seeding users...');
    const userIds = [];
    for (let i = 0; i < 10; i++) {
      const [user] = await db.insert(usersTable).values({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      }).returning({ id: usersTable.id });
      userIds.push(user.id);
    }

    // Seed todos
    console.log('Seeding todos...');
    const todoIds = [];
    for (let i = 0; i < 20; i++) {
      const [todo] = await db.insert(todosTable).values({
        user_id: userIds[randomInt(0, userIds.length - 1)],
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        status: faker.helpers.arrayElement(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
      }).returning({ id: todosTable.id });
      todoIds.push(todo.id);
    }

    // Seed tasks
    console.log('Seeding tasks...');
    const taskIds = [];
    for (let i = 0; i < 30; i++) {
      const [task] = await db.insert(tasksTable).values({
        user_id: userIds[randomInt(0, userIds.length - 1)],
        team_id: teamIds[randomInt(0, teamIds.length - 1)],
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        status: faker.helpers.arrayElement(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
        due_date: faker.date.future(),
      }).returning({ id: tasksTable.id });
      taskIds.push(task.id);
    }

    // Seed notifications
    console.log('Seeding notifications...');
    for (let i = 0; i < 50; i++) {
      await db.insert(notificationsTable).values({
        user_id: userIds[randomInt(0, userIds.length - 1)],
        title: faker.lorem.sentence(),
        message: faker.lorem.paragraph(),
        is_read: faker.datatype.boolean(),
      });
    }

    // Seed sub-tasks
    console.log('Seeding sub-tasks...');
    for (let i = 0; i < 60; i++) {
      await db.insert(subTasksTable).values({
        task_id: taskIds[randomInt(0, taskIds.length - 1)],
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        status: faker.helpers.arrayElement(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
        due_date: faker.date.future(),
      });
    }

    // Seed chats
    console.log('Seeding chats...');
    const chatIds = [];
    for (let i = 0; i < 15; i++) {
      // Ensure creator and recipient are different users
      const creatorIndex = randomInt(0, userIds.length - 1);
      let recipientIndex;
      do {
        recipientIndex = randomInt(0, userIds.length - 1);
      } while (recipientIndex === creatorIndex);

      const [chat] = await db.insert(chatsTable).values({
        creator_id: userIds[creatorIndex],
        recipient_id: userIds[recipientIndex],
      }).returning({ id: chatsTable.id });
      chatIds.push(chat.id);
    }

    // Seed chat messages
    console.log('Seeding chat messages...');
    for (let i = 0; i < 100; i++) {
      const chatId = chatIds[randomInt(0, chatIds.length - 1)];

      // Get the chat to determine valid sender IDs
      const chat = await db.select().from(chatsTable).where(eq(chatsTable.id, chatId)).limit(1);

      if (chat.length > 0) {
        const senderId = faker.helpers.arrayElement([chat[0].creator_id, chat[0].recipient_id]);

        await db.insert(chatMessagesTable).values({
          chat_id: chatId,
          sender_id: senderId,
          content: faker.lorem.paragraph(),
          is_read: faker.datatype.boolean(),
        });
      }
    }

    // Seed categories
    console.log('Seeding categories...');
    const categoryIds = [];
    const categoryNames = ['電子機器', '家具', '衣類', '食品', '書籍', 'スポーツ用品', 'おもちゃ', '化粧品'];

    for (let i = 0; i < categoryNames.length; i++) {
      const [category] = await db.insert(categoriesTable).values({
        name: categoryNames[i],
        description: faker.lorem.sentence(),
      }).returning({ id: categoriesTable.id });
      categoryIds.push(category.id);
    }

    // Seed companies
    console.log('Seeding companies...');
    const companyIds = [];
    try {
      for (let i = 0; i < 10; i++) {
        const [company] = await db.insert(companiesTable).values({
          name: faker.company.name(),
          description: faker.company.catchPhrase(),
          address: faker.location.streetAddress() + ', ' + faker.location.city() + ', ' + faker.location.country(),
          phone: faker.phone.number(),
          email: faker.internet.email(),
          website: faker.internet.url(),
        }).returning({ id: companiesTable.id });
        companyIds.push(company.id);
      }
      console.log('✅ Companies seeded successfully!');
    } catch (error) {
      console.error('❌ Error seeding companies:', error);
      console.log('⚠️ Skipping companies seeding. Make sure to run migrations to create the companies table.');
    }

    // Seed countries
    console.log('Seeding countries...');
    const countryData = [
      { name: '日本', code: 'JP', flag_url: 'https://example.com/flags/jp.png' },
      { name: 'アメリカ合衆国', code: 'US', flag_url: 'https://example.com/flags/us.png' },
      { name: 'イギリス', code: 'GB', flag_url: 'https://example.com/flags/gb.png' },
      { name: 'フランス', code: 'FR', flag_url: 'https://example.com/flags/fr.png' },
      { name: 'ドイツ', code: 'DE', flag_url: 'https://example.com/flags/de.png' },
      { name: '中国', code: 'CN', flag_url: 'https://example.com/flags/cn.png' },
      { name: '韓国', code: 'KR', flag_url: 'https://example.com/flags/kr.png' },
      { name: 'オーストラリア', code: 'AU', flag_url: 'https://example.com/flags/au.png' },
      { name: 'カナダ', code: 'CA', flag_url: 'https://example.com/flags/ca.png' },
      { name: 'インド', code: 'IN', flag_url: 'https://example.com/flags/in.png' }
    ];

    try {
      for (const country of countryData) {
        await db.insert(countriesTable).values(country);
      }
      console.log('✅ Countries seeded successfully!');
    } catch (error) {
      console.error('❌ Error seeding countries:', error);
      console.log('⚠️ Skipping countries seeding. Make sure to run migrations to create the countries table.');
    }

    // Seed inquiries
    console.log('Seeding inquiries...');
    try {
      const inquiryStatuses = ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
      for (let i = 0; i < 15; i++) {
        await db.insert(inquiriesTable).values({
          name: faker.person.fullName(),
          email: faker.internet.email(),
          subject: faker.lorem.sentence(5),
          message: faker.lorem.paragraphs(2),
          status: faker.helpers.arrayElement(inquiryStatuses),
        });
      }
      console.log('✅ Inquiries seeded successfully!');
    } catch (error) {
      console.error('❌ Error seeding inquiries:', error);
      console.log('⚠️ Skipping inquiries seeding. Make sure to run migrations to create the inquiries table.');
    }

    // Seed contacts
    console.log('Seeding contacts...');
    try {
      const contactStatuses = ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
      for (let i = 0; i < 20; i++) {
        await db.insert(contactsTable).values({
          name: faker.person.fullName(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          subject: faker.lorem.sentence(5),
          message: faker.lorem.paragraphs(2),
          status: faker.helpers.arrayElement(contactStatuses),
        });
      }
      console.log('✅ Contacts seeded successfully!');
    } catch (error) {
      console.error('❌ Error seeding contacts:', error);
      console.log('⚠️ Skipping contacts seeding. Make sure to run migrations to create the contacts table.');
    }

    // Seed products
    console.log('Seeding products...');
    const productIds = [];
    for (let i = 0; i < 20; i++) {
      const [product] = await db.insert(productsTable).values({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseInt(faker.commerce.price({ min: 500, max: 50000, dec: 0 })),
        stock: randomInt(0, 100),
        image_url: faker.image.url(),
        category_id: categoryIds[randomInt(0, categoryIds.length - 1)],
      }).returning({ id: productsTable.id });
      productIds.push(product.id);
    }

    // Seed orders
    console.log('Seeding orders...');
    const orderIds = [];
    for (let i = 0; i < 25; i++) {
      const [order] = await db.insert(ordersTable).values({
        user_id: userIds[randomInt(0, userIds.length - 1)],
        total_amount: 0, // Will update after adding items
        status: faker.helpers.arrayElement(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
      }).returning({ id: ordersTable.id });
      orderIds.push(order.id);
    }

    // Seed order items and update order total amounts
    console.log('Seeding order items...');
    for (const orderId of orderIds) {
      let totalAmount = 0;
      const numItems = randomInt(1, 5);

      for (let i = 0; i < numItems; i++) {
        const productId = productIds[randomInt(0, productIds.length - 1)];
        const product = await db.select({ price: productsTable.price })
          .from(productsTable)
          .where(eq(productsTable.id, productId))
          .limit(1);

        if (product.length > 0) {
          const quantity = randomInt(1, 5);
          const price = product[0].price;

          await db.insert(orderItemsTable).values({
            order_id: orderId,
            product_id: productId,
            quantity: quantity,
            price: price,
          });

          totalAmount += price * quantity;
        }
      }

      // Update order total amount
      await db.update(ordersTable)
        .set({ total_amount: totalAmount })
        .where(eq(ordersTable.id, orderId));
    }

    // Seed invoices
    console.log('Seeding invoices...');
    try {
      const invoiceStatuses = ['PENDING', 'PAID', 'OVERDUE', 'CANCELLED'];
      const paymentMethods = ['CREDIT_CARD', 'BANK_TRANSFER', 'PAYPAL', 'CASH'];

      for (const orderId of orderIds) {
        // Get order details
        const order = await db.select({ 
          userId: ordersTable.user_id, 
          totalAmount: ordersTable.total_amount 
        })
          .from(ordersTable)
          .where(eq(ordersTable.id, orderId))
          .limit(1);

        if (order.length > 0) {
          const invoiceNumber = `INV-${faker.string.alphanumeric(8).toUpperCase()}`;
          const issueDate = faker.date.recent();
          const dueDate = faker.date.future({ refDate: issueDate });

          await db.insert(invoicesTable).values({
            order_id: orderId,
            invoice_number: invoiceNumber,
            issue_date: issueDate,
            due_date: dueDate,
            total_amount: order[0].totalAmount,
            status: faker.helpers.arrayElement(invoiceStatuses),
            payment_method: faker.helpers.arrayElement(paymentMethods),
            notes: faker.datatype.boolean() ? faker.lorem.paragraph() : null,
          });
        }
      }
      console.log('✅ Invoices seeded successfully!');
    } catch (error) {
      console.error('❌ Error seeding invoices:', error);
      console.log('⚠️ Skipping invoices seeding. Make sure to run migrations to create the invoices table.');
    }

    // Seed baseball teams
    console.log('Seeding baseball teams...');
    const baseballTeamIds = [];
    try {
      const teams = ['Giants', 'Tigers', 'Carp', 'Dragons', 'BayStars', 'Swallows', 'Fighters', 'Hawks', 'Eagles', 'Marines', 'Buffaloes', 'Lions'];
      const leagues = ['Central League', 'Pacific League'];
      const cities = ['Tokyo', 'Osaka', 'Hiroshima', 'Nagoya', 'Yokohama', 'Tokyo', 'Sapporo', 'Fukuoka', 'Sendai', 'Chiba', 'Osaka', 'Tokorozawa'];
      const stadiums = ['Tokyo Dome', 'Koshien Stadium', 'Mazda Stadium', 'Nagoya Dome', 'Yokohama Stadium', 'Jingu Stadium', 'Sapporo Dome', 'Fukuoka PayPay Dome', 'Rakuten Seimei Park', 'ZOZO Marine Stadium', 'Kyocera Dome', 'Belluna Dome'];

      for (let i = 0; i < teams.length; i++) {
        const [team] = await db.insert(baseballTeamsTable).values({
          name: teams[i],
          abbreviation: teams[i].substring(0, 3).toUpperCase(),
          league: i < 6 ? leagues[0] : leagues[1],
          division: 'Division 1',
          home_stadium: stadiums[i],
          city: cities[i],
          founded_year: faker.number.int({ min: 1920, max: 1980 }),
          team_color: faker.color.rgb(),
          logo_url: `https://example.com/logos/${teams[i].toLowerCase()}.png`,
          website_url: `https://www.${teams[i].toLowerCase()}.jp`,
          description: faker.lorem.paragraph(),
        }).returning({ id: baseballTeamsTable.id });

        baseballTeamIds.push(team.id);
      }
      console.log('✅ Baseball teams seeded successfully!');
    } catch (error) {
      console.error('❌ Error seeding baseball teams:', error);
      console.log('⚠️ Skipping baseball teams seeding. Make sure to run migrations to create the baseball_teams table.');
    }

    // Seed baseball players
    console.log('Seeding baseball players...');
    const baseballPlayerIds = [];
    try {
      const positions = ['Pitcher', 'Catcher', 'First Base', 'Second Base', 'Third Base', 'Shortstop', 'Left Field', 'Center Field', 'Right Field', 'Designated Hitter'];

      // Get the teams we just created
      const teams = await db.select().from(baseballTeamsTable);

      for (let i = 0; i < 30; i++) {
        const isPitcher = faker.helpers.arrayElement(positions) === 'Pitcher' || Math.random() < 0.3;
        const team = faker.helpers.arrayElement(teams);

        const [player] = await db.insert(baseballPlayersTable).values({
          name: faker.person.fullName(),
          team: team.name,
          position: faker.helpers.arrayElement(positions),
          batting_average: isPitcher ? faker.number.float({ min: 0.1, max: 0.25, precision: 0.001 }) : faker.number.float({ min: 0.2, max: 0.35, precision: 0.001 }),
          home_runs: isPitcher ? faker.number.int({ min: 0, max: 5 }) : faker.number.int({ min: 0, max: 45 }),
          runs_batted_in: isPitcher ? faker.number.int({ min: 0, max: 15 }) : faker.number.int({ min: 20, max: 120 }),
          stolen_bases: isPitcher ? faker.number.int({ min: 0, max: 3 }) : faker.number.int({ min: 0, max: 50 }),
          era: isPitcher ? faker.number.float({ min: 2.0, max: 6.0, precision: 0.01 }) : null,
          wins: isPitcher ? faker.number.int({ min: 0, max: 20 }) : null,
          losses: isPitcher ? faker.number.int({ min: 0, max: 15 }) : null,
          saves: isPitcher ? faker.number.int({ min: 0, max: 30 }) : null,
        }).returning({ id: baseballPlayersTable.id });

        baseballPlayerIds.push(player.id);
      }
      console.log('✅ Baseball players seeded successfully!');
    } catch (error) {
      console.error('❌ Error seeding baseball players:', error);
      console.log('⚠️ Skipping baseball players seeding. Make sure to run migrations to create the baseball_players table.');
    }

    // Seed baseball games
    console.log('Seeding baseball games...');
    const baseballGameIds = [];
    try {
      // Get the teams we just created
      const teams = await db.select().from(baseballTeamsTable);

      if (teams.length === 0) {
        throw new Error("No baseball teams found. Make sure baseball teams are seeded first.");
      }

      // Generate game dates for the last 30 days
      const gameDates = [];
      for (let i = 1; i <= 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        gameDates.push(date);
      }

      // Create baseball games
      for (let i = 0; i < 20; i++) {
        // Ensure home and away teams are different
        const homeTeamIndex = randomInt(0, teams.length - 1);
        let awayTeamIndex;
        do {
          awayTeamIndex = randomInt(0, teams.length - 1);
        } while (awayTeamIndex === homeTeamIndex);

        const homeTeam = teams[homeTeamIndex];
        const awayTeam = teams[awayTeamIndex];
        const gameDate = faker.helpers.arrayElement(gameDates);

        // Create a baseball game
        const [game] = await db.insert(baseballGamesTable).values({
          date: gameDate,
          home_team_id: homeTeam.id,
          away_team_id: awayTeam.id,
          stadium: homeTeam.home_stadium,
          home_score: randomInt(0, 10),
          away_score: randomInt(0, 10),
          status: faker.helpers.arrayElement(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED']),
          start_time: gameDate,
          end_time: new Date(gameDate.getTime() + 3 * 60 * 60 * 1000), // Game lasts about 3 hours
          attendance: randomInt(15000, 45000),
          weather: faker.helpers.arrayElement(['Sunny', 'Cloudy', 'Rainy', 'Clear']),
        }).returning({ id: baseballGamesTable.id });

        baseballGameIds.push(game.id);
      }
      console.log('✅ Baseball games seeded successfully!');
    } catch (error) {
      console.error('❌ Error seeding baseball games:', error);
      console.log('⚠️ Skipping baseball games seeding. Make sure to run migrations to create the baseball_games table.');
    }

    // Seed baseball game stats
    console.log('Seeding baseball game stats...');
    try {
      // Get all teams
      const teams = await db.select().from(baseballTeamsTable);

      if (teams.length === 0) {
        throw new Error("No baseball teams found. Make sure baseball teams are seeded first.");
      }

      // For each player, create 1-5 game stats
      for (const playerId of baseballPlayerIds) {
        // Get player info to determine if they're a pitcher and their team
        const player = await db.select().from(baseballPlayersTable).where(eq(baseballPlayersTable.id, playerId)).limit(1);

        if (player.length > 0 && baseballGameIds.length > 0) {
          const isPitcher = player[0].position === 'Pitcher' || player[0].era !== null;
          const numGames = randomInt(1, Math.min(5, baseballGameIds.length));

          // Find the player's team
          const playerTeam = teams.find(team => team.name === player[0].team);

          if (!playerTeam) {
            console.warn(`Could not find team for player ${player[0].name} (${player[0].team}). Skipping game stats.`);
            continue;
          }

          // Select random games for this player
          const playerGameIds = faker.helpers.arrayElements(baseballGameIds, numGames);

          for (const gameId of playerGameIds) {
            // Create game stat with appropriate values based on player type
            const atBats = isPitcher ? randomInt(0, 4) : randomInt(3, 5);
            const hits = randomInt(0, Math.min(atBats, 4));

            await db.insert(baseballGameStatsTable).values({
              player_id: playerId,
              game_id: gameId,
              team_id: playerTeam.id,
              at_bats: atBats,
              hits: hits,
              runs: randomInt(0, 3),
              home_runs: isPitcher ? randomInt(0, 1) : randomInt(0, 2),
              runs_batted_in: isPitcher ? randomInt(0, 2) : randomInt(0, 5),
              stolen_bases: isPitcher ? 0 : randomInt(0, 2),
              innings_pitched: isPitcher ? randomInt(1, 9) : null,
              hits_allowed: isPitcher ? randomInt(0, 10) : null,
              earned_runs: isPitcher ? randomInt(0, 7) : null,
              strikeouts: isPitcher ? randomInt(0, 12) : null,
              walks: isPitcher ? randomInt(0, 5) : null,
            });
          }
        }
      }
      console.log('✅ Baseball game stats seeded successfully!');
    } catch (error) {
      console.error('❌ Error seeding baseball game stats:', error);
      console.log('⚠️ Skipping baseball game stats seeding. Make sure to run migrations to create the baseball_game_stats table.');
    }

    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    // Close the database connection
    await client.end();
  }
}

// Run the seed function
seed();
