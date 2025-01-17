/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { utils, values } from '@syuilo/aiscript';
import * as os from '@/os.js';
import { misskeyApi } from '@/scripts/misskey-api.js';
import { $i } from '@/account.js';
import { customEmojis } from '@/custom-emojis.js';
import { url, lang } from '@/config.js';
import { nyaize } from '@/scripts/nyaize.js';
import { StorageMetadata, loadScriptStorage, saveScriptStorage } from './storage.js';

export function aiScriptReadline(q: string): Promise<string> {
	return new Promise(ok => {
		os.inputText({
			title: q,
		}).then(({ result: a }) => {
			ok(a ?? '');
		});
	});
}

export function createAiScriptEnv(opts: { token: string; storageMetadata: StorageMetadata; }) {
	return {
		USER_ID: $i ? values.STR($i.id) : values.NULL,
		USER_NAME: $i ? values.STR($i.name) : values.NULL,
		USER_USERNAME: $i ? values.STR($i.username) : values.NULL,
		CUSTOM_EMOJIS: utils.jsToVal(customEmojis.value),
		LOCALE: values.STR(lang),
		SERVER_URL: values.STR(url),
		'Mk:dialog': values.FN_NATIVE(async ([title, text, type]) => {
			await os.alert({
				type: type ? type.value : 'info',
				title: title.value,
				text: text.value,
			});
			return values.NULL;
		}),
		'Mk:confirm': values.FN_NATIVE(async ([title, text, type]) => {
			const confirm = await os.confirm({
				type: type ? type.value : 'question',
				title: title.value,
				text: text.value,
			});
			return confirm.canceled ? values.FALSE : values.TRUE;
		}),
		'Mk:api': values.FN_NATIVE(async ([ep, param, token]) => {
			utils.assertString(ep);
			if (ep.value.includes('://')) throw new Error('invalid endpoint');
			if (token) {
				utils.assertString(token);
				// バグがあればundefinedもあり得るため念のため
				if (typeof token.value !== 'string') throw new Error('invalid token');
			}
			const actualToken: string|null = token?.value ?? opts.token ?? null;
			return misskeyApi(ep.value, utils.valToJs(param), actualToken).then(res => {
				return utils.jsToVal(res);
			}, err => {
				return values.ERROR('request_failed', utils.jsToVal(err));
			});
		}),
		/* セキュリティ上の問題があるため無効化
		'Mk:apiExternal': values.FN_NATIVE(async ([host, ep, param, token]) => {
			utils.assertString(host);
			utils.assertString(ep);
			if (token) utils.assertString(token);
			return os.apiExternal(host.value, ep.value, utils.valToJs(param), token?.value).then(res => {
				return utils.jsToVal(res);
			}, err => {
				return values.ERROR('request_failed', utils.jsToVal(err));
			});
		}),
		*/
		'Mk:save': values.FN_NATIVE(async ([key, value, option]) => {
			utils.assertString(key);
			if (option) {
				utils.assertObject(option);
				if (option.value.has('toAccount')) {
					utils.assertBoolean(option.value.get('toAccount'));
				}
			}
			const saveToAccount = option && option.value.has('toAccount') ? option.value.get('toAccount').value : false;
			return saveScriptStorage(saveToAccount, opts.storageMetadata, key.value, utils.valToJs(value)).then(() => {
				return values.NULL;
			}, err => {
				return values.ERROR('request_failed', utils.jsToVal(err));
			});
		}),
		'Mk:load': values.FN_NATIVE(async ([key, option]) => {
			utils.assertString(key);
			if (option) {
				utils.assertObject(option);
				if (option.value.has('toAccount')) {
					utils.assertBoolean(option.value.get('toAccount'));
				}
			}
			const loadToAccount = option && option.value.has('toAccount') ? option.value.get('toAccount').value : false;
			return loadScriptStorage(loadToAccount, opts.storageMetadata, key.value).then(res => {
				return utils.jsToVal(res);
			}, err => {
				return values.ERROR('request_failed', utils.jsToVal(err));
			});
		}),
		'Mk:url': values.FN_NATIVE(() => {
			return values.STR(window.location.href);
		}),
		'Mk:nyaize': values.FN_NATIVE(([text]) => {
			utils.assertString(text);
			return values.STR(nyaize(text.value));
		}),
		...(opts.storageMetadata.type === 'flash' ? {
			'Mk:claimAchieve': values.FN_NATIVE(([achieveId]) => {
				utils.assertString(achieveId);
				return misskeyApi('i/claim-achievement', { name: achieveId.value, flashId: opts.storageMetadata.id }).then(_ => {
					return values.NULL;
				}, err => {
					return values.ERROR('request_failed', utils.jsToVal(err));
				});
			}),
		} : {}),
	};
}
