import { assert } from "tsafe/assert";
import type { Thunks, State as RootState } from "../core";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { id } from "tsafe/id";
import { addParamToUrl } from "powerhooks/tools/urlSearchParams";

type State = State.NotInitialized | State.Ready;

namespace State {
    export type NotInitialized = {
        stateDescription: "not initialized";
        isInitializing: boolean;
    };

    export type Ready = {
        stateDescription: "ready";
        passwordResetUrlWithoutLangParam: string | undefined;
        allowedEmailRegexpStr: string;
        allOrganizations: string[];
        organization: {
            value: string;
            isBeingUpdated: boolean;
        };
        email: {
            value: string;
            isBeingUpdated: boolean;
        };
        about: {
            value: string;
            isBeingUpdated: boolean;
        };
        isPublic: {
            value: boolean;
            isBeingUpdated: boolean;
        };
    };
}

export const name = "userAccountManagement";

export const { reducer, actions } = createSlice({
    name,
    "initialState": id<State>({
        "stateDescription": "not initialized",
        "isInitializing": false
    }),
    "reducers": {
        "initializeStarted": state => {
            assert(state.stateDescription === "not initialized");

            state.isInitializing = true;
        },
        "initialized": (
            _state,
            {
                payload
            }: PayloadAction<{
                passwordResetUrlWithoutLangParam: string | undefined;
                allowedEmailRegexpStr: string;
                organization: string;
                email: string;
                allOrganizations: string[];
                about: string;
                isPublic: boolean;
            }>
        ) => {
            const {
                passwordResetUrlWithoutLangParam,
                allowedEmailRegexpStr,
                organization,
                email,
                allOrganizations,
                about,
                isPublic
            } = payload;

            return {
                "stateDescription": "ready",
                passwordResetUrlWithoutLangParam,
                allowedEmailRegexpStr,
                allOrganizations,
                "organization": {
                    "value": organization,
                    "isBeingUpdated": false
                },
                "email": {
                    "value": email,
                    "isBeingUpdated": false
                },
                "about": {
                    "value": about,
                    "isBeingUpdated": false
                },
                "isPublic": {
                    "value": isPublic,
                    "isBeingUpdated": false
                }
            };
        },
        "updateFieldStarted": (
            state,
            {
                payload
            }: PayloadAction<
                | {
                      fieldName: "organization" | "email" | "about";
                      value: string;
                  }
                | {
                      fieldName: "isPublic";
                      value: boolean;
                  }
            >
        ) => {
            assert(state.stateDescription === "ready");

            if (payload.fieldName === "isPublic") {
                state[payload.fieldName] = {
                    value: payload.value,
                    "isBeingUpdated": true
                };

                return;
            }

            state[payload.fieldName] = {
                value: payload.value,
                "isBeingUpdated": true
            };
        },
        "updateFieldCompleted": (
            state,
            {
                payload
            }: PayloadAction<{
                fieldName: "organization" | "email" | "about" | "isPublic";
            }>
        ) => {
            const { fieldName } = payload;

            assert(state.stateDescription === "ready");

            state[fieldName].isBeingUpdated = false;
        }
    }
});

export const thunks = {
    "initialize":
        () =>
        async (...args) => {
            const [dispatch, getState, { oidc, getUser, sillApi }] = args;

            {
                const state = getState()[name];

                if (state.stateDescription === "ready" || state.isInitializing) {
                    return;
                }
            }

            dispatch(actions.initializeStarted());

            assert(oidc.isUserLoggedIn);

            const user = await getUser();

            const [
                { keycloakParams },
                allowedEmailRegexpStr,
                allOrganizations,
                { about = "", isPublic }
            ] = await Promise.all([
                sillApi.getOidcParams(),
                sillApi.getAllowedEmailRegexp(),
                sillApi.getAllOrganizations(),
                sillApi.getAgentAbout({ "email": user.email })
            ]);

            dispatch(
                actions.initialized({
                    allowedEmailRegexpStr,
                    "email": user.email,
                    "organization": user.organization,
                    "passwordResetUrlWithoutLangParam":
                        keycloakParams === undefined
                            ? undefined
                            : addParamToUrl({
                                  "url": [
                                      keycloakParams.url.replace(/\/$/, ""),
                                      "realms",
                                      keycloakParams.realm,
                                      "account",
                                      "password"
                                  ].join("/"),
                                  "name": "referrer",
                                  "value": keycloakParams.clientId
                              }).newUrl,
                    allOrganizations,
                    about,
                    isPublic
                })
            );
        },
    "updateField":
        (
            params:
                | { fieldName: "organization" | "email" | "about"; value: string }
                | {
                      fieldName: "isPublic";
                      value: boolean;
                  }
        ) =>
        async (...args) => {
            const [dispatch, getState, { sillApi, oidc }] = args;

            dispatch(actions.updateFieldStarted(params));

            const state = getState()[name];

            assert(state.stateDescription === "ready");

            switch (params.fieldName) {
                case "organization":
                    await sillApi.changeAgentOrganization({
                        "newOrganization": params.value
                    });
                    break;
                case "email":
                    await sillApi.updateEmail({ "newEmail": params.value });
                    break;
                case "about":
                    await sillApi.updateAgentAbout({
                        "about": params.value || undefined,
                        "isPublic": state.isPublic.value
                    });
                    break;
                case "isPublic":
                    await sillApi.updateAgentAbout({
                        "about": state.about.value || undefined,
                        "isPublic": params.value
                    });
                    break;
            }

            assert(oidc.isUserLoggedIn);

            await oidc.updateTokenInfo();

            dispatch(actions.updateFieldCompleted({ "fieldName": params.fieldName }));
        },
    "getPasswordResetUrl":
        () =>
        (...args): string => {
            const [
                ,
                getState,
                {
                    coreParams: { getCurrentLang }
                }
            ] = args;

            const state = getState()[name];

            assert(state.stateDescription === "ready");

            assert(state.passwordResetUrlWithoutLangParam !== undefined);

            let url = state.passwordResetUrlWithoutLangParam;

            {
                const { newUrl } = addParamToUrl({
                    url,
                    "name": "referrer_uri",
                    "value": window.location.href
                });

                url = newUrl;
            }

            {
                const { newUrl } = addParamToUrl({
                    url,
                    "name": "kc_locale",
                    "value": getCurrentLang()
                });

                url = newUrl;
            }

            return url;
        }
} satisfies Thunks;

export const selectors = (() => {
    const readyState = (rootState: RootState) => {
        const state = rootState[name];

        if (state.stateDescription !== "ready") {
            return undefined;
        }

        const { stateDescription, passwordResetUrlWithoutLangParam, ...rest } = state;

        return {
            ...rest,
            "doSupportPasswordReset": passwordResetUrlWithoutLangParam !== undefined
        };
    };

    return { readyState };
})();
