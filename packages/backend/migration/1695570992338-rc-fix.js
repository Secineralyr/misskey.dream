export class RcFix1695570992338 {
    name = 'RcFix1695570992338'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "drive_file" DROP CONSTRAINT "FK_860fa6f6c7df5bb887249fba22e"`);
        await queryRunner.query(`ALTER TABLE "announcement" ADD "icon" character varying(256) NOT NULL DEFAULT 'info'`);
        await queryRunner.query(`ALTER TABLE "announcement" ADD "display" character varying(256) NOT NULL DEFAULT 'normal'`);
        await queryRunner.query(`ALTER TABLE "announcement" ADD "needConfirmationToRead" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "announcement" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "announcement" ADD "forExistingUsers" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "announcement" ADD "userId" character varying(32)`);
        await queryRunner.query(`ALTER TABLE "channel" ADD "isSensitive" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "note" ADD "clippedCount" smallint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "following" ADD "notify" character varying(32)`);
        await queryRunner.query(`ALTER TABLE "meta" ADD "shortName" character varying(64)`);
        await queryRunner.query(`ALTER TABLE "meta" ADD "app192IconUrl" character varying(1024)`);
        await queryRunner.query(`ALTER TABLE "meta" ADD "app512IconUrl" character varying(1024)`);
        await queryRunner.query(`ALTER TABLE "meta" ADD "manifestJsonOverride" character varying(8192) NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "user_profile" ADD "verifiedLinks" character varying array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "user_profile" ADD "twoFactorBackupSecret" character varying array`);
        await queryRunner.query(`ALTER TABLE "user_security_key" ADD "counter" bigint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`COMMENT ON COLUMN "user_security_key"."counter" IS 'The number of times the UserSecurityKey was validated.'`);
        await queryRunner.query(`ALTER TABLE "user_security_key" ADD "credentialDeviceType" character varying(32)`);
        await queryRunner.query(`COMMENT ON COLUMN "user_security_key"."credentialDeviceType" IS 'The type of Backup Eligibility in authenticator data'`);
        await queryRunner.query(`ALTER TABLE "user_security_key" ADD "credentialBackedUp" boolean`);
        await queryRunner.query(`COMMENT ON COLUMN "user_security_key"."credentialBackedUp" IS 'Whether or not the credential has been backed up'`);
        await queryRunner.query(`ALTER TABLE "user_security_key" ADD "transports" character varying(32) array`);
        await queryRunner.query(`COMMENT ON COLUMN "user_security_key"."transports" IS 'The type of the credential returned by the browser'`);
        await queryRunner.query(`ALTER TABLE "flash" ADD "visibility" character varying(512) NOT NULL DEFAULT 'public'`);
        await queryRunner.query(`ALTER TYPE "public"."antenna_src_enum" RENAME TO "antenna_src_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."antenna_src_enum" AS ENUM('home', 'all', 'users', 'list', 'users_blacklist')`);
        await queryRunner.query(`ALTER TABLE "antenna" ALTER COLUMN "src" TYPE "public"."antenna_src_enum" USING "src"::"text"::"public"."antenna_src_enum"`);
        await queryRunner.query(`DROP TYPE "public"."antenna_src_enum_old"`);
        await queryRunner.query(`ALTER TABLE "meta" ALTER COLUMN "cacheRemoteFiles" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "meta" ALTER COLUMN "preservedUsernames" SET DEFAULT '{ "admin", "administrator", "root", "system", "maintainer", "host", "mod", "moderator", "owner", "superuser", "staff", "auth", "i", "me", "everyone", "all", "mention", "mentions", "example", "user", "users", "account", "accounts", "official", "help", "helps", "support", "supports", "info", "information", "informations", "announce", "announces", "announcement", "announcements", "notice", "notification", "notifications", "dev", "developer", "developers", "tech", "misskey" }'`);
        await queryRunner.query(`ALTER TYPE "public"."user_profile_mutingnotificationtypes_enum" RENAME TO "user_profile_mutingnotificationtypes_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."user_profile_mutingnotificationtypes_enum" AS ENUM('note', 'follow', 'mention', 'reply', 'renote', 'quote', 'reaction', 'pollEnded', 'receiveFollowRequest', 'followRequestAccepted', 'achievementEarned', 'app', 'test', 'pollVote', 'groupInvited')`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "mutingNotificationTypes" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "mutingNotificationTypes" TYPE "public"."user_profile_mutingnotificationtypes_enum"[] USING "mutingNotificationTypes"::"text"::"public"."user_profile_mutingnotificationtypes_enum"[]`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "mutingNotificationTypes" SET DEFAULT '{}'`);
        await queryRunner.query(`DROP TYPE "public"."user_profile_mutingnotificationtypes_enum_old"`);
        await queryRunner.query(`COMMENT ON COLUMN "user_security_key"."publicKey" IS 'The public key of the UserSecurityKey, hex-encoded.'`);
        await queryRunner.query(`COMMENT ON COLUMN "user_security_key"."lastUsed" IS 'Timestamp of the last time the UserSecurityKey was used.'`);
        await queryRunner.query(`ALTER TABLE "user_security_key" ALTER COLUMN "lastUsed" SET DEFAULT now()`);
        await queryRunner.query(`CREATE INDEX "IDX_bc1afcc8ef7e9400cdc3c0a87e" ON "announcement" ("isActive") `);
        await queryRunner.query(`CREATE INDEX "IDX_da795d3a83187e8832005ba19d" ON "announcement" ("forExistingUsers") `);
        await queryRunner.query(`CREATE INDEX "IDX_fd25dfe3da37df1715f11ba6ec" ON "announcement" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5108098457488634a4768e1d12" ON "following" ("notify") `);
        await queryRunner.query(`ALTER TABLE "drive_file" ADD CONSTRAINT "FK_860fa6f6c7df5bb887249fba22e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "announcement" ADD CONSTRAINT "FK_fd25dfe3da37df1715f11ba6ec8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "announcement" DROP CONSTRAINT "FK_fd25dfe3da37df1715f11ba6ec8"`);
        await queryRunner.query(`ALTER TABLE "drive_file" DROP CONSTRAINT "FK_860fa6f6c7df5bb887249fba22e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5108098457488634a4768e1d12"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fd25dfe3da37df1715f11ba6ec"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_da795d3a83187e8832005ba19d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bc1afcc8ef7e9400cdc3c0a87e"`);
        await queryRunner.query(`ALTER TABLE "user_security_key" ALTER COLUMN "lastUsed" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "user_security_key"."lastUsed" IS 'The date of the last time the UserSecurityKey was successfully validated.'`);
        await queryRunner.query(`COMMENT ON COLUMN "user_security_key"."publicKey" IS 'Variable-length public key used to verify attestations (hex-encoded).'`);
        await queryRunner.query(`CREATE TYPE "public"."user_profile_mutingnotificationtypes_enum_old" AS ENUM('follow', 'mention', 'reply', 'renote', 'quote', 'reaction', 'pollVote', 'pollEnded', 'receiveFollowRequest', 'followRequestAccepted', 'groupInvited', 'achievementEarned', 'app')`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "mutingNotificationTypes" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "mutingNotificationTypes" TYPE "public"."user_profile_mutingnotificationtypes_enum_old"[] USING "mutingNotificationTypes"::"text"::"public"."user_profile_mutingnotificationtypes_enum_old"[]`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "mutingNotificationTypes" SET DEFAULT '{}'`);
        await queryRunner.query(`DROP TYPE "public"."user_profile_mutingnotificationtypes_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."user_profile_mutingnotificationtypes_enum_old" RENAME TO "user_profile_mutingnotificationtypes_enum"`);
        await queryRunner.query(`ALTER TABLE "meta" ALTER COLUMN "preservedUsernames" SET DEFAULT '{admin,administrator,root,system,maintainer,host,mod,moderator,owner,superuser,staff,auth,i,me,everyone,all,mention,mentions,example,user,users,account,accounts,official,help,helps,support,supports,info,information,informations,announce,announces,announcement,announcements,notice,notification,notifications,dev,developer,developers,tech,misskey}'`);
        await queryRunner.query(`ALTER TABLE "meta" ALTER COLUMN "cacheRemoteFiles" SET DEFAULT true`);
        await queryRunner.query(`CREATE TYPE "public"."antenna_src_enum_old" AS ENUM('home', 'all', 'users', 'list')`);
        await queryRunner.query(`ALTER TABLE "antenna" ALTER COLUMN "src" TYPE "public"."antenna_src_enum_old" USING "src"::"text"::"public"."antenna_src_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."antenna_src_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."antenna_src_enum_old" RENAME TO "antenna_src_enum"`);
        await queryRunner.query(`ALTER TABLE "flash" DROP COLUMN "visibility"`);
        await queryRunner.query(`COMMENT ON COLUMN "user_security_key"."transports" IS 'The type of the credential returned by the browser'`);
        await queryRunner.query(`ALTER TABLE "user_security_key" DROP COLUMN "transports"`);
        await queryRunner.query(`COMMENT ON COLUMN "user_security_key"."credentialBackedUp" IS 'Whether or not the credential has been backed up'`);
        await queryRunner.query(`ALTER TABLE "user_security_key" DROP COLUMN "credentialBackedUp"`);
        await queryRunner.query(`COMMENT ON COLUMN "user_security_key"."credentialDeviceType" IS 'The type of Backup Eligibility in authenticator data'`);
        await queryRunner.query(`ALTER TABLE "user_security_key" DROP COLUMN "credentialDeviceType"`);
        await queryRunner.query(`COMMENT ON COLUMN "user_security_key"."counter" IS 'The number of times the UserSecurityKey was validated.'`);
        await queryRunner.query(`ALTER TABLE "user_security_key" DROP COLUMN "counter"`);
        await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "twoFactorBackupSecret"`);
        await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "verifiedLinks"`);
        await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "manifestJsonOverride"`);
        await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "app512IconUrl"`);
        await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "app192IconUrl"`);
        await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "shortName"`);
        await queryRunner.query(`ALTER TABLE "following" DROP COLUMN "notify"`);
        await queryRunner.query(`ALTER TABLE "note" DROP COLUMN "clippedCount"`);
        await queryRunner.query(`ALTER TABLE "channel" DROP COLUMN "isSensitive"`);
        await queryRunner.query(`ALTER TABLE "announcement" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "announcement" DROP COLUMN "forExistingUsers"`);
        await queryRunner.query(`ALTER TABLE "announcement" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "announcement" DROP COLUMN "needConfirmationToRead"`);
        await queryRunner.query(`ALTER TABLE "announcement" DROP COLUMN "display"`);
        await queryRunner.query(`ALTER TABLE "announcement" DROP COLUMN "icon"`);
        await queryRunner.query(`ALTER TABLE "drive_file" ADD CONSTRAINT "FK_860fa6f6c7df5bb887249fba22e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
}
