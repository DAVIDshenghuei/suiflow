module startHack::suiflow {
    use sui::event;
    use sui::sui::SUI;
    use sui::coin::{Self, Coin};
    use sui::balance::{Self, Balance};
    use std::string::{String};

    // Errors
    const EInsufficientPayment: u64 = 0;
    const ENotAuthorized: u64 = 1;

    // Structs
    public struct Workflow has key, store {
        id: UID,
        name: String,
        description: String,
        price: u64,
        creator: address,
        balance: Balance<SUI>,
    }

    public struct WorkflowResult has key, store {
        id: UID,
        workflow_id: ID,
        name: String,
        description: String,
        walrus_blob_id: String,
        timestamp: u64,
    }

    public struct AdminCap has key {
        id: UID,
    }

    // Events
    public struct WorkflowCreated has copy, drop {
        workflow_id: ID,
        name: String,
        creator: address,
        price: u64,
    }

    public struct WorkflowRequest has copy, drop {
        workflow_id: ID,
        requester: address,
        amount_paid: u64,
    }

    public struct WorkflowCompleted has copy, drop {
        workflow_id: ID,
        result_id: ID,
        requester: address,
        walrus_blob_id: String,
    }

    // Functions
    fun init(ctx: &mut TxContext) {
        transfer::transfer(AdminCap {
            id: object::new(ctx)
        }, tx_context::sender(ctx));
    }

    public entry fun create_workflow(
        name: String,
        description: String,
        price: u64,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let id = object::new(ctx);
        let workflow_id = object::uid_to_inner(&id);

        let workflow = Workflow {
            id,
            name,
            description,
            price,
            creator: sender,
            balance: balance::zero(),
        };

        event::emit(WorkflowCreated {
            workflow_id,
            name,
            creator: sender,
            price,
        });

        transfer::share_object(workflow);
    }

    public entry fun pay_to_run(
        workflow: &mut Workflow,
        payment: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        let value = coin::value(&payment);
        assert!(value >= workflow.price, EInsufficientPayment);

        let paid_balance = coin::into_balance(payment);
        balance::join(&mut workflow.balance, paid_balance);

        event::emit(WorkflowRequest {
            workflow_id: object::id(workflow),
            requester: tx_context::sender(ctx),
            amount_paid: value,
        });
    }

    public entry fun complete_workflow(
        _admin: &AdminCap,
        workflow: &Workflow,
        requester: address,
        walrus_blob_id: String,
        result_name: String,
        result_description: String,
        ctx: &mut TxContext
    ) {
        let id = object::new(ctx);
        let result_id = object::uid_to_inner(&id);

        let result = WorkflowResult {
            id,
            workflow_id: object::id(workflow),
            name: result_name,
            description: result_description,
            walrus_blob_id,
            timestamp: tx_context::epoch(ctx),
        };

        event::emit(WorkflowCompleted {
            workflow_id: object::id(workflow),
            result_id,
            requester,
            walrus_blob_id,
        });

        transfer::public_transfer(result, requester);
    }

    public entry fun withdraw(
        workflow: &mut Workflow,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == workflow.creator, ENotAuthorized);
        
        let amount = balance::value(&workflow.balance);
        let cash = coin::take(&mut workflow.balance, amount, ctx);
        
        transfer::public_transfer(cash, workflow.creator);
    }
}
