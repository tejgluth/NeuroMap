-- NeuroMaps uses Supabase REST/RPC, not GraphQL.
-- Keep table grants for REST, but remove public GraphQL schema access to reduce API surface area.

revoke usage on schema graphql from anon, authenticated;
revoke usage on schema graphql_public from anon, authenticated;
revoke execute on all functions in schema graphql from anon, authenticated;
revoke execute on all functions in schema graphql_public from anon, authenticated;

revoke usage on schema graphql from public;
revoke usage on schema graphql_public from public;
revoke execute on all functions in schema graphql from public;
revoke execute on all functions in schema graphql_public from public;
