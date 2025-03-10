import { assert, type Equals } from "tsafe/assert";
import type { TrpcRouterInput, TrpcRouterOutput } from "@codegouvfr/sill";

export type SillApi = {
    getApiVersion: {
        (params: TrpcRouterInput["getApiVersion"]): Promise<
            TrpcRouterOutput["getApiVersion"]
        >;
        clear: () => void;
    };
    getOidcParams: {
        (params: TrpcRouterInput["getOidcParams"]): Promise<
            TrpcRouterOutput["getOidcParams"]
        >;
        clear: () => void;
    };
    getOrganizationUserProfileAttributeName: {
        (params: TrpcRouterInput["getOrganizationUserProfileAttributeName"]): Promise<
            TrpcRouterOutput["getOrganizationUserProfileAttributeName"]
        >;
        clear: () => void;
    };
    getSoftwares: {
        (params: TrpcRouterInput["getSoftwares"]): Promise<
            TrpcRouterOutput["getSoftwares"]
        >;
        clear: () => void;
    };
    getInstances: {
        (): Promise<TrpcRouterOutput["getInstances"]>;
        clear: () => void;
    };
    getWikidataOptions: (
        params: TrpcRouterInput["getWikidataOptions"]
    ) => Promise<TrpcRouterOutput["getWikidataOptions"]>;
    getSoftwareFormAutoFillDataFromWikidataAndOtherSources: (
        params: TrpcRouterInput["getSoftwareFormAutoFillDataFromWikidataAndOtherSources"]
    ) => Promise<
        TrpcRouterOutput["getSoftwareFormAutoFillDataFromWikidataAndOtherSources"]
    >;
    createSoftware: (
        params: TrpcRouterInput["createSoftware"]
    ) => Promise<TrpcRouterOutput["createSoftware"]>;
    updateSoftware: (
        params: TrpcRouterInput["updateSoftware"]
    ) => Promise<TrpcRouterOutput["updateSoftware"]>;
    createUserOrReferent: (
        params: TrpcRouterInput["createUserOrReferent"]
    ) => Promise<TrpcRouterOutput["createUserOrReferent"]>;
    removeUserOrReferent: (
        params: TrpcRouterInput["removeUserOrReferent"]
    ) => Promise<TrpcRouterOutput["removeUserOrReferent"]>;
    createInstance: (
        params: TrpcRouterInput["createInstance"]
    ) => Promise<TrpcRouterOutput["createInstance"]>;
    updateInstance: (
        params: TrpcRouterInput["updateInstance"]
    ) => Promise<TrpcRouterOutput["updateInstance"]>;
    getAgents: {
        (params: TrpcRouterInput["getAgents"]): Promise<TrpcRouterOutput["getAgents"]>;
        clear: () => void;
    };
    changeAgentOrganization: (
        params: TrpcRouterInput["changeAgentOrganization"]
    ) => Promise<TrpcRouterOutput["changeAgentOrganization"]>;

    updateEmail: (
        params: TrpcRouterInput["updateEmail"]
    ) => Promise<TrpcRouterOutput["updateEmail"]>;

    getAllowedEmailRegexp: {
        (): Promise<TrpcRouterOutput["getAllowedEmailRegexp"]>;
        clear: () => void;
    };
    getAllOrganizations: {
        (params: TrpcRouterInput["getAllOrganizations"]): Promise<
            TrpcRouterOutput["getAllOrganizations"]
        >;
        clear: () => void;
    };
    getTotalReferentCount: {
        (params: TrpcRouterInput["getTotalReferentCount"]): Promise<
            TrpcRouterOutput["getTotalReferentCount"]
        >;
        clear: () => void;
    };
    getRegisteredUserCount: {
        (params: TrpcRouterInput["getRegisteredUserCount"]): Promise<
            TrpcRouterOutput["getRegisteredUserCount"]
        >;
        clear: () => void;
    };
    getTermsOfServiceUrl: {
        (params: TrpcRouterInput["getTermsOfServiceUrl"]): Promise<
            TrpcRouterOutput["getTermsOfServiceUrl"]
        >;
        clear: () => void;
    };
    getMarkdown: (
        params: TrpcRouterInput["getMarkdown"]
    ) => Promise<TrpcRouterOutput["getMarkdown"]>;
    getIsAgentProfilePublic: (
        params: TrpcRouterInput["getIsAgentProfilePublic"]
    ) => Promise<TrpcRouterOutput["getIsAgentProfilePublic"]>;
    getAgent: (
        params: TrpcRouterInput["getAgent"]
    ) => Promise<TrpcRouterOutput["getAgent"]>;
    updateAgentAbout: (
        params: TrpcRouterInput["updateAgentAbout"]
    ) => Promise<TrpcRouterOutput["updateAgentAbout"]>;
    updateIsAgentProfilePublic: (
        params: TrpcRouterInput["updateIsAgentProfilePublic"]
    ) => Promise<TrpcRouterOutput["updateIsAgentProfilePublic"]>;
};

//NOTE: We make sure we don't forget queries
{
    type X = Exclude<keyof SillApi, keyof TrpcRouterInput>;
    type Y = Exclude<keyof TrpcRouterInput, keyof SillApi>;

    assert<Equals<X, never>>();
    assert<Equals<Y, never>>();
}
