import {
	FastifyBaseLogger,
	FastifyPluginAsync,
	RawReplyDefaultExpression,
	RawRequestDefaultExpression,
	RawServerBase,
	RawServerDefault,
	FastifyTypeProvider,
	FastifyTypeProviderDefault,
	preHandlerAsyncHookHandler,
	preHandlerHookHandler,
	FastifySchema,
	ContextConfigDefault,
	RouteGenericInterface,
	FastifyRequest,
	FastifyReply,
	HookHandlerDoneFunction,
	RouteHandlerMethod,
	RouteShorthandOptions,
	RouteShorthandOptionsWithHandler,
	onRequestHookHandler,
	onRequestAsyncHookHandler,
	onResponseHookHandler,
	onResponseAsyncHookHandler,
	onErrorHookHandler,
	onErrorAsyncHookHandler,
	onCloseHookHandler,
	onCloseAsyncHookHandler,
	onRouteHookHandler,
	FastifyError,
	RouteOptions,
} from 'fastify';

type AsyncFunction = (...args: any) => Promise<any>;

declare module 'fastify' {
	export interface FastifyInstance<
		RawServer extends RawServerBase = RawServerDefault,
		RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
		RawReply extends RawReplyDefaultExpression<RawServer> = RawReplyDefaultExpression<RawServer>,
		Logger extends FastifyBaseLogger = FastifyBaseLogger,
		TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault
	> {
		/**
		 * `onRequest` is the first hook to be executed in the request lifecycle. There was no previous hook, the next hook will be `preParsing`.
		 *  Notice: in the `onRequest` hook, request.body will always be null, because the body parsing happens before the `preHandler` hook.
		 */
		addHook<
			RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
			ContextConfig = ContextConfigDefault,
			SchemaCompiler extends FastifySchema = FastifySchema,
			Logger extends FastifyBaseLogger = FastifyBaseLogger,
			Fn extends
				| onRequestHookHandler<
						RawServer,
						RawRequest,
						RawReply,
						RouteGeneric,
						ContextConfig,
						SchemaCompiler,
						TypeProvider,
						Logger
				  >
				| onRequestAsyncHookHandler<
						RawServer,
						RawRequest,
						RawReply,
						RouteGeneric,
						ContextConfig,
						SchemaCompiler,
						TypeProvider,
						Logger
				  > = onRequestHookHandler<
				RawServer,
				RawRequest,
				RawReply,
				RouteGeneric,
				ContextConfig,
				SchemaCompiler,
				TypeProvider,
				Logger
			>
		>(
			name: 'onRequest',
			hook: Fn extends unknown
				? Fn extends AsyncFunction
					? onRequestAsyncHookHandler<
							RawServer,
							RawRequest,
							RawReply,
							RouteGeneric,
							ContextConfig,
							SchemaCompiler,
							TypeProvider,
							Logger
					  >
					: onRequestHookHandler<
							RawServer,
							RawRequest,
							RawReply,
							RouteGeneric,
							ContextConfig,
							SchemaCompiler,
							TypeProvider,
							Logger
					  >
				: Fn
		): FastifyInstance<RawServer, RawRequest, RawReply, Logger, TypeProvider>;

		/**
		 * `onResponse` is the seventh and last hook in the request hook lifecycle. The previous hook was `onSend`, there is no next hook.
		 * The onResponse hook is executed when a response has been sent, so you will not be able to send more data to the client. It can however be useful for sending data to external services, for example to gather statistics.
		 */
		addHook<
			RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
			ContextConfig = ContextConfigDefault,
			SchemaCompiler extends FastifySchema = FastifySchema,
			Logger extends FastifyBaseLogger = FastifyBaseLogger,
			Fn extends
				| onResponseHookHandler<
						RawServer,
						RawRequest,
						RawReply,
						RouteGeneric,
						ContextConfig,
						SchemaCompiler,
						TypeProvider,
						Logger
				  >
				| onResponseAsyncHookHandler<
						RawServer,
						RawRequest,
						RawReply,
						RouteGeneric,
						ContextConfig,
						SchemaCompiler,
						TypeProvider,
						Logger
				  > = onResponseHookHandler<
				RawServer,
				RawRequest,
				RawReply,
				RouteGeneric,
				ContextConfig,
				SchemaCompiler,
				TypeProvider,
				Logger
			>
		>(
			name: 'onResponse',
			hook: Fn extends unknown
				? Fn extends AsyncFunction
					? onResponseAsyncHookHandler<
							RawServer,
							RawRequest,
							RawReply,
							RouteGeneric,
							ContextConfig,
							SchemaCompiler,
							TypeProvider,
							Logger
					  >
					: onResponseHookHandler<
							RawServer,
							RawRequest,
							RawReply,
							RouteGeneric,
							ContextConfig,
							SchemaCompiler,
							TypeProvider,
							Logger
					  >
				: Fn
		): FastifyInstance<RawServer, RawRequest, RawReply, Logger, TypeProvider>;

		/**
		 * This hook is useful if you need to do some custom error logging or add some specific header in case of error.
		 * It is not intended for changing the error, and calling reply.send will throw an exception.
		 * This hook will be executed only after the customErrorHandler has been executed, and only if the customErrorHandler sends an error back to the user (Note that the default customErrorHandler always sends the error back to the user).
		 * Notice: unlike the other hooks, pass an error to the done function is not supported.
		 */
		addHook<
			RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
			ContextConfig = ContextConfigDefault,
			SchemaCompiler extends FastifySchema = FastifySchema,
			Logger extends FastifyBaseLogger = FastifyBaseLogger,
			Fn extends
				| onErrorHookHandler<
						RawServer,
						RawRequest,
						RawReply,
						RouteGeneric,
						ContextConfig,
						FastifyError,
						SchemaCompiler,
						TypeProvider,
						Logger
				  >
				| onErrorAsyncHookHandler<
						RawServer,
						RawRequest,
						RawReply,
						RouteGeneric,
						ContextConfig,
						FastifyError,
						SchemaCompiler,
						TypeProvider,
						Logger
				  > = onErrorHookHandler<
				RawServer,
				RawRequest,
				RawReply,
				RouteGeneric,
				ContextConfig,
				FastifyError,
				SchemaCompiler,
				TypeProvider,
				Logger
			>
		>(
			name: 'onError',
			hook: Fn extends unknown
				? Fn extends AsyncFunction
					? onErrorAsyncHookHandler<
							RawServer,
							RawRequest,
							RawReply,
							RouteGeneric,
							ContextConfig,
							FastifyError,
							SchemaCompiler,
							TypeProvider,
							Logger
					  >
					: onErrorHookHandler<
							RawServer,
							RawRequest,
							RawReply,
							RouteGeneric,
							ContextConfig,
							FastifyError,
							SchemaCompiler,
							TypeProvider,
							Logger
					  >
				: Fn
		): FastifyInstance<RawServer, RawRequest, RawReply, Logger, TypeProvider>;

		/**
		 * Triggered when fastify.close() is invoked to stop the server. It is useful when plugins need a "shutdown" event, for example to close an open connection to a database.
		 */
		addHook<Fn extends onCloseHookHandler | onCloseAsyncHookHandler = onCloseHookHandler>(
			name: 'onClose',
			hook: Fn extends unknown ? (Fn extends AsyncFunction ? onCloseAsyncHookHandler : onCloseHookHandler) : Fn
		): FastifyInstance<RawServer, RawRequest, RawReply, Logger, TypeProvider>;

		/**
		 * Triggered when a new route is registered. Listeners are passed a routeOptions object as the sole parameter. The interface is synchronous, and, as such, the listener does not get passed a callback
		 */
		addHook<
			RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
			ContextConfig = ContextConfigDefault,
			SchemaCompiler extends FastifySchema = FastifySchema,
			Logger extends FastifyBaseLogger = FastifyBaseLogger
		>(
			name: 'onRoute',
			hook: onRouteHookHandler<
				RawServer,
				RawRequest,
				RawReply,
				RouteGeneric,
				ContextConfig,
				SchemaCompiler,
				TypeProvider,
				Logger
			>
		): FastifyInstance<RawServer, RawRequest, RawReply, Logger, TypeProvider>;

		/**
		 * `preHandler` is the fourth hook to be executed in the request lifecycle. The previous hook was `preValidation`, the next hook will be `preSerialization`.
		 */
		addHook<
			RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
			ContextConfig = ContextConfigDefault,
			SchemaCompiler extends FastifySchema = FastifySchema,
			Logger extends FastifyBaseLogger = FastifyBaseLogger,
			Fn extends
				| preHandlerHookHandler<
						RawServer,
						RawRequest,
						RawReply,
						RouteGeneric,
						ContextConfig,
						SchemaCompiler,
						TypeProvider,
						Logger
				  >
				| preHandlerAsyncHookHandler<
						RawServer,
						RawRequest,
						RawReply,
						RouteGeneric,
						ContextConfig,
						SchemaCompiler,
						TypeProvider,
						Logger
				  > = preHandlerHookHandler<
				RawServer,
				RawRequest,
				RawReply,
				RouteGeneric,
				ContextConfig,
				SchemaCompiler,
				TypeProvider,
				Logger
			>
		>(
			name: 'preHandler',
			hook: Fn extends unknown
				? Fn extends AsyncFunction
					? preHandlerAsyncHookHandler<
							RawServer,
							RawRequest,
							RawReply,
							RouteGeneric,
							ContextConfig,
							SchemaCompiler,
							TypeProvider,
							Logger
					  >
					: preHandlerHookHandler<
							RawServer,
							RawRequest,
							RawReply,
							RouteGeneric,
							ContextConfig,
							SchemaCompiler,
							TypeProvider,
							Logger
					  >
				: Fn
		): FastifyInstance<RawServer, RawRequest, RawReply, Logger, TypeProvider>;

		route<
			RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
			ContextConfig = ContextConfigDefault,
			const SchemaCompiler extends FastifySchema = FastifySchema
		>(
			opts: RouteOptions<
				RawServer,
				RawRequest,
				RawReply,
				RouteGeneric,
				ContextConfig,
				SchemaCompiler,
				TypeProvider,
				Logger
			>
		): FastifyInstance<RawServer, RawRequest, RawReply, Logger, TypeProvider>;

		post: RouteShorthandMethod<RawServer, RawRequest, RawReply, TypeProvider, Logger>;
	}

	export interface RouteShorthandMethod<
		RawServer extends RawServerBase = RawServerDefault,
		RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
		RawReply extends RawReplyDefaultExpression<RawServer> = RawReplyDefaultExpression<RawServer>,
		TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault,
		Logger extends FastifyBaseLogger = FastifyBaseLogger
	> {
		<
			RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
			ContextConfig = ContextConfigDefault,
			const SchemaCompiler extends FastifySchema = FastifySchema
		>(
			path: string,
			opts: RouteShorthandOptions<
				RawServer,
				RawRequest,
				RawReply,
				RouteGeneric,
				ContextConfig,
				SchemaCompiler,
				TypeProvider,
				Logger
			>,
			handler: RouteHandlerMethod<
				RawServer,
				RawRequest,
				RawReply,
				RouteGeneric,
				ContextConfig,
				SchemaCompiler,
				TypeProvider,
				Logger
			>
		): FastifyInstance<RawServer, RawRequest, RawReply, Logger, TypeProvider>;
		<
			RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
			ContextConfig = ContextConfigDefault,
			const SchemaCompiler extends FastifySchema = FastifySchema
		>(
			path: string,
			handler: RouteHandlerMethod<
				RawServer,
				RawRequest,
				RawReply,
				RouteGeneric,
				ContextConfig,
				SchemaCompiler,
				TypeProvider,
				Logger
			>
		): FastifyInstance<RawServer, RawRequest, RawReply, Logger, TypeProvider>;
		<
			RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
			ContextConfig = ContextConfigDefault,
			const SchemaCompiler extends FastifySchema = FastifySchema
		>(
			path: string,
			opts: RouteShorthandOptionsWithHandler<
				RawServer,
				RawRequest,
				RawReply,
				RouteGeneric,
				ContextConfig,
				SchemaCompiler,
				TypeProvider,
				Logger
			>
		): FastifyInstance<RawServer, RawRequest, RawReply, Logger, TypeProvider>;
	}
}
