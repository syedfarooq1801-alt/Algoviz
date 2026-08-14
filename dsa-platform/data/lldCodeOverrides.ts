// Whiteboard-sized replacements for the longest LLD code blocks.
//
// The originals were compiling-grade C++ — includes, move semantics, raw
// pointer bookkeeping, id generators — averaging 47 lines and peaking at 100.
// None of that is what an LLD round grades. The interviewer wants the classes,
// how they relate, and the two or three methods where a real decision lives.
// Everything else is noise you'd never write on a whiteboard.
//
// Rules these follow: no #includes, no std:: prefixes, no getters/setters,
// declare-only for anything mechanical, and a comment on each line where a
// design decision (not a language detail) is being made. Target ~30 lines.
//
// Keyed by `${subjectId}/${chapterId}`; applied in data/lld.ts, which swaps
// the FIRST `pre` block of the chapter.

export const LLD_CODE_OVERRIDES: Record<string, string> = {
  "lld-problems-classic/parking-lot": `enum class VehicleType { MOTORCYCLE, CAR, TRUCK };
enum class SpotType    { COMPACT, REGULAR, LARGE };

struct Vehicle { string plate; VehicleType type; };

class ParkingSpot {
    SpotType type;
    Vehicle* parked = nullptr;              // nullptr = free
public:
    bool isFree() const { return !parked; }

    // The only real rule in the problem: which vehicle fits which spot.
    bool canFit(const Vehicle& v) const {
        if (!isFree()) return false;
        if (v.type == VehicleType::MOTORCYCLE) return true;          // fits anything
        if (v.type == VehicleType::CAR)        return type != SpotType::COMPACT;
        return type == SpotType::LARGE;                              // TRUCK
    }
    void park(Vehicle& v) { parked = &v; }
    void vacate()         { parked = nullptr; }
};

struct Ticket { string id; Vehicle* vehicle; ParkingSpot* spot; time_t entry; };

class ParkingFloor {
    vector<ParkingSpot> spots;              // composition: floor owns its spots
public:
    ParkingSpot* findSpot(const Vehicle& v);   // first spot where canFit()
};

// Strategy — pricing changes (weekend rates, EV discount) without
// ParkingLot ever being reopened.
class PricingStrategy {
public:
    virtual double fee(const Ticket&, time_t exit) const = 0;
    virtual ~PricingStrategy() = default;
};

class ParkingLot {
    vector<ParkingFloor> floors;            // lot owns floors owns spots
    unordered_map<string, Ticket> active;   // ticketId -> open ticket
    unique_ptr<PricingStrategy> pricing;    // injected, not hardcoded
public:
    Ticket* park(Vehicle& v);               // first fitting spot -> ticket, or null if full
    double  unpark(const string& ticketId); // vacate spot, price via strategy, close ticket
};`,

  "lld-problems-classic/library-system": `enum class Status { AVAILABLE, BORROWED, RESERVED };

// A Book is the title; a BookCopy is the physical thing you borrow.
// Collapsing these two is the mistake this design exists to avoid.
struct Book     { string isbn, title, author; };
struct BookCopy { string barcode; Book* book; Status status = Status::AVAILABLE; };

struct Member {
    string id, name;
    vector<Loan*> active;
    static constexpr int MAX_LOANS = 5;
    bool canBorrow() const { return active.size() < MAX_LOANS; }
};

struct Loan {
    BookCopy* copy; Member* member;
    time_t issuedOn, dueOn;
    time_t returnedOn = 0;
    bool isOverdue(time_t now) const { return !returnedOn && now > dueOn; }
};

class FinePolicy {                          // Strategy: fine rules vary by library
public:
    virtual double fine(const Loan&, time_t now) const = 0;
    virtual ~FinePolicy() = default;
};

class Library {
    unordered_map<string, vector<BookCopy>> byIsbn;   // isbn -> its copies
    unordered_map<string, Member> members;
    unique_ptr<FinePolicy> fines;
public:
    BookCopy* findAvailable(const string& isbn);      // first AVAILABLE copy

    // Guarded by canBorrow() and copy availability — the two invariants.
    Loan* checkout(Member&, const string& isbn);
    double returnCopy(const string& barcode);         // frees copy, charges via policy
    void   reserve(Member&, const string& isbn);      // queue when all copies out
};`,

  "lld-problems-classic/chess-game": `enum class Color { WHITE, BLACK };
struct Position { int row, col; bool valid() const { return row>=0 && row<8 && col>=0 && col<8; } };

// Polymorphism is the whole design: every piece answers "where can I go?"
// for itself, so Board never grows an if-ladder over piece types.
class Piece {
public:
    Color color;
    bool  hasMoved = false;
    virtual vector<Position> moves(Position from, const Board&) const = 0;
    virtual ~Piece() = default;
};

class Rook   : public Piece { vector<Position> moves(Position, const Board&) const override; };
class Knight : public Piece { vector<Position> moves(Position, const Board&) const override; };
// ... Bishop, Queen, King, Pawn

class Board {
    Piece* grid[8][8] = {};                 // nullptr = empty square
public:
    Piece* at(Position p) const { return grid[p.row][p.col]; }
    void   set(Position p, Piece* x) { grid[p.row][p.col] = x; }

    // "Is my king attacked?" == "can any enemy piece reach the king's square?"
    // Reusing moves() for this is what keeps check detection tiny.
    bool inCheck(Color c) const;
    Position findKing(Color c) const;
};

class Game {
    Board board;
    Color turn = Color::WHITE;
    vector<Move> history;                   // needed for en passant + castling
public:
    // Rejects a move that is pseudo-legal but leaves your own king in check —
    // simulate on a copy, test inCheck(), roll back.
    bool play(Position from, Position to);
    bool isCheckmate(Color c);              // inCheck AND no move escapes it
};`,

  "lld-problems-classic/atm-design": `// State pattern. Each state implements only the transitions legal from it,
// so "withdraw before PIN" is unrepresentable rather than guarded by an
// if-check repeated in every method.
class ATMState {
public:
    virtual void insertCard(ATM&, Card)   { throw logic_error("not allowed here"); }
    virtual void enterPin(ATM&, int)      { throw logic_error("not allowed here"); }
    virtual void withdraw(ATM&, int)      { throw logic_error("not allowed here"); }
    virtual void ejectCard(ATM&)          { throw logic_error("not allowed here"); }
    virtual ~ATMState() = default;
};

class ATM {
    unique_ptr<ATMState> state;
    CashDispenser cash;
    Account* account = nullptr;
public:
    void setState(unique_ptr<ATMState> s) { state = move(s); }
    // Public API just delegates — no status branching anywhere in ATM itself.
    void insertCard(Card c) { state->insertCard(*this, c); }
    void enterPin(int p)    { state->enterPin(*this, p); }
    void withdraw(int amt)  { state->withdraw(*this, amt); }
};

class IdleState : public ATMState {
    void insertCard(ATM& a, Card c) override { a.setState(make_unique<PinState>(c)); }
};

class AuthenticatedState : public ATMState {
    void withdraw(ATM& a, int amt) override {
        if (!a.cash.canDispense(amt)) throw runtime_error("cannot make that amount");
        a.account->debit(amt);              // debit FIRST — it is the reversible half
        try { a.cash.dispense(amt); }
        catch (...) { a.account->credit(amt); throw; }   // compensate; cash is not recoverable
    }
};

class CashDispenser {
    map<int,int,greater<int>> notes;        // denomination -> count, largest first
public:
    bool canDispense(int amount) const;     // plan greedily WITHOUT mutating
    void dispense(int amount);              // commit only after a full plan exists
};`,

  "lld-problems-classic/elevator-system": `enum class Direction { UP, DOWN, IDLE };

struct Request { int floor; Direction dir; };   // dir matters: up-call vs down-call

class Elevator {
    int id, current = 0;
    Direction dir = Direction::IDLE;
    set<int> up;                            // stops above, ascending
    set<int, greater<int>> down;            // stops below, descending
public:
    // Two sorted sets is the trick: serve everything in one direction in
    // order, then flip. That IS the elevator (SCAN / lift) algorithm.
    void addStop(int floor) {
        if (floor > current) up.insert(floor); else down.insert(floor);
    }
    int  next() const;                      // peek the head of the active set
    void step();                            // move one floor, pop on arrival, flip when empty

    // How suitable am I for this request? Lower = better. This is what makes
    // dispatch pluggable instead of "always pick elevator 0".
    int costFor(const Request&) const;
};

class Dispatcher {                          // Strategy: swap the assignment rule
public:
    virtual Elevator& pick(vector<Elevator>&, const Request&) = 0;
    virtual ~Dispatcher() = default;
};

class NearestCarDispatcher : public Dispatcher {
    Elevator& pick(vector<Elevator>& cars, const Request& r) override;  // min costFor()
};

class ElevatorSystem {
    vector<Elevator> cars;
    unique_ptr<Dispatcher> dispatcher;
public:
    void requestFromFloor(const Request& r) { dispatcher->pick(cars, r).addStop(r.floor); }
    void requestFromInside(int car, int floor) { cars[car].addStop(floor); }
    void tick();                            // step() every car once
};`,

  "lld-problems-realworld/splitwise": `// Money as a graph: balance[a][b] = what a owes b. Every split just adds
// edges; settling up is edge simplification. That framing is the answer.
class SplitStrategy {                       // Strategy: equal / exact / percent
public:
    virtual map<User*, double> split(double amount, const vector<User*>&) const = 0;
    virtual ~SplitStrategy() = default;
};

class EqualSplit   : public SplitStrategy { /* amount / n, remainder to payer */ };
class PercentSplit : public SplitStrategy { /* validates percentages sum to 100 */ };

struct Expense {
    string id, description;
    double amount;
    User*  paidBy;
    vector<User*> among;
    unique_ptr<SplitStrategy> how;
};

class BalanceSheet {
    // owed[a][b] > 0 means a owes b. Kept net: adding b->a cancels a->b.
    map<User*, map<User*, double>> owed;
public:
    void record(const Expense& e) {
        for (auto& [user, share] : e.how->split(e.amount, e.among))
            if (user != e.paidBy) add(user, e.paidBy, share);
    }
    void add(User* from, User* to, double amt);   // nets against the reverse edge
    double between(User* a, User* b) const;

    // Minimum cash flow: settle by repeatedly matching the biggest debtor
    // against the biggest creditor. Greedy, and what they want to hear.
    vector<Settlement> simplify() const;
};

class Group {
    vector<User*> members;
    vector<Expense> expenses;
    BalanceSheet sheet;
public:
    void addExpense(Expense e) { sheet.record(e); expenses.push_back(move(e)); }
    vector<Settlement> settleUp() const { return sheet.simplify(); }
};`,

  "lld-problems-realworld/movie-ticket-booking": `enum class SeatState { AVAILABLE, HELD, BOOKED };

struct Seat { string id; SeatState state = SeatState::AVAILABLE; };

// The entire problem is this: two users must not book the same seat.
// Everything else is scaffolding around that one invariant.
class Show {
    string id;
    Movie* movie; Screen* screen;
    time_t startsAt;
    unordered_map<string, Seat> seats;
    mutex lock;                             // one lock per show, not one global lock
public:
    // Hold, don't book: the user needs time to pay. Held seats expire so a
    // dropped checkout doesn't strand inventory forever.
    bool hold(const vector<string>& seatIds, User* u, seconds ttl) {
        scoped_lock g(lock);                            // check-and-set must be atomic
        for (auto& s : seatIds)
            if (seats[s].state != SeatState::AVAILABLE) return false;
        for (auto& s : seatIds) seats[s].state = SeatState::HELD;
        scheduleExpiry(seatIds, ttl);                   // revert to AVAILABLE on timeout
        return true;
    }
    bool confirm(const vector<string>& seatIds);        // HELD -> BOOKED, only for the holder
    void release(const vector<string>& seatIds);        // HELD -> AVAILABLE
};

struct Booking {
    string id; User* user; Show* show;
    vector<string> seats;
    PaymentStatus payment = PaymentStatus::PENDING;
};

class BookingService {
    PaymentGateway* gateway;
public:
    // hold -> pay -> confirm. Payment failure releases the hold, so seats
    // never leak on a failed card.
    Booking* book(User&, Show&, const vector<string>& seatIds);
};`,

  "lld-problems-realworld/ride-sharing": `enum class TripState { REQUESTED, ASSIGNED, ONGOING, COMPLETED, CANCELLED };

struct Location { double lat, lng; double distanceTo(const Location&) const; };

class Driver {
    string id;
    Location at;
    bool available = true;
public:
    friend class DriverIndex;
};

// Finding nearby drivers by scanning every driver is the naive version.
// A geospatial index (geohash / quadtree buckets) is the real answer.
class DriverIndex {
    unordered_map<string, vector<Driver*>> byCell;   // geohash cell -> drivers
public:
    void update(Driver&, Location);                  // move between cells
    vector<Driver*> near(Location, double radiusKm) const;  // this cell + neighbours
};

class MatchingStrategy {                    // Strategy: nearest / highest-rated / surge-aware
public:
    virtual Driver* pick(const vector<Driver*>&, const Trip&) const = 0;
    virtual ~MatchingStrategy() = default;
};

class PricingStrategy {                     // Strategy: base / surge / pooled
public:
    virtual double fare(double km, minutes eta, double surge) const = 0;
    virtual ~PricingStrategy() = default;
};

class Trip {
    TripState state = TripState::REQUESTED;
    Rider* rider; Driver* driver = nullptr;
    Location from, to;
public:
    void assign(Driver&);                   // REQUESTED -> ASSIGNED, marks driver busy
    void start();                           // ASSIGNED  -> ONGOING
    void complete();                        // ONGOING   -> COMPLETED, frees driver, charges
};

class RideService {
    DriverIndex index;
    unique_ptr<MatchingStrategy> matcher;
    unique_ptr<PricingStrategy>  pricer;
public:
    // Offer to candidates in order; first acceptance wins. Never hard-assign,
    // or one unresponsive driver strands the rider.
    Trip* request(Rider&, Location from, Location to);
};`,

  "lld-problems-realworld/food-delivery": `enum class OrderState { PLACED, ACCEPTED, PREPARING, READY, PICKED_UP, DELIVERED, CANCELLED };

struct MenuItem { string id, name; double price; bool available = true; };

class Restaurant {
    string id; Location at;
    vector<MenuItem> menu;
    bool acceptingOrders = true;
public:
    bool canFulfil(const Cart&) const;      // every line still available
};

struct Cart {
    Restaurant* from;
    vector<pair<MenuItem*, int>> lines;     // item -> qty
    double subtotal() const;
};

// Explicit state machine: the legal transitions are data, so an illegal
// jump (PLACED -> DELIVERED) is rejected in one place instead of everywhere.
class Order {
    OrderState state = OrderState::PLACED;
    static const map<OrderState, vector<OrderState>> ALLOWED;
public:
    Cart cart; User* customer; Agent* agent = nullptr;
    void transition(OrderState to);         // throws if to is not in ALLOWED.at(state)
};

class DeliveryAssigner {                    // Strategy: nearest / batched / cheapest
public:
    virtual Agent* pick(const vector<Agent*>&, const Order&) const = 0;
    virtual ~DeliveryAssigner() = default;
};

// Observer: customer app, restaurant tablet and agent app all react to the
// same state change without Order knowing any of them.
class OrderObserver {
public:
    virtual void onStateChange(const Order&) = 0;
    virtual ~OrderObserver() = default;
};

class OrderService {
    vector<OrderObserver*> observers;
    unique_ptr<DeliveryAssigner> assigner;
public:
    Order* place(User&, Cart);
    void   advance(Order&, OrderState to);  // transition, then notify observers
};`,

  "lld-problems-realworld/twitter-design": `struct Tweet { long id; User* author; string text; time_t at; };

class SocialGraph {
    unordered_map<User*, unordered_set<User*>> following;
public:
    void follow(User* a, User* b)   { following[a].insert(b); }
    void unfollow(User* a, User* b) { following[a].erase(b); }
    const unordered_set<User*>& followees(User* u) const;
};

// The whole interview is fan-out on write vs fan-out on read.
//  - write: push each tweet into every follower's cached timeline.
//           Fast reads, but a celebrity with 50M followers stalls the write.
//  - read:  merge followees' tweets at request time. Cheap writes, slow reads.
// Real answer: hybrid — push for normal users, pull for celebrities.
class TimelineStrategy {
public:
    virtual void onTweet(const Tweet&) = 0;
    virtual vector<Tweet> timeline(User*, int limit) = 0;
    virtual ~TimelineStrategy() = default;
};

class FanoutOnWrite : public TimelineStrategy {
    unordered_map<User*, deque<Tweet>> cache;   // capped per user
};

class FanoutOnRead : public TimelineStrategy {
    // k-way merge of followees' recent tweets, newest first — a heap over
    // one iterator per followee, exactly Merge K Sorted Lists.
};

class Twitter {
    SocialGraph graph;
    unordered_map<User*, vector<Tweet>> byAuthor;
    unique_ptr<TimelineStrategy> timelines;
public:
    void postTweet(User*, const string& text);
    vector<Tweet> getFeed(User*, int limit = 10);
};`,

  "design-patterns-behavioral/command": `// Command = an action turned into an object. Because the object stores what
// it needs to reverse itself, undo/redo becomes two stacks and nothing else.
class Command {
public:
    virtual void execute() = 0;
    virtual void undo()    = 0;
    virtual ~Command() = default;
};

class TextEditor {
public:
    string text;
    void insert(int pos, const string& s) { text.insert(pos, s); }
    void erase(int pos, int len)          { text.erase(pos, len); }
};

class InsertCommand : public Command {
    TextEditor& ed; int pos; string chars;
public:
    void execute() override { ed.insert(pos, chars); }
    void undo()    override { ed.erase(pos, chars.size()); }
};

class DeleteCommand : public Command {
    TextEditor& ed; int pos, len;
    string deleted;                         // captured on execute so undo can restore it
public:
    void execute() override { deleted = ed.text.substr(pos, len); ed.erase(pos, len); }
    void undo()    override { ed.insert(pos, deleted); }
};

class History {
    vector<unique_ptr<Command>> done, undone;
public:
    void run(unique_ptr<Command> c) {
        c->execute();
        done.push_back(move(c));
        undone.clear();                     // a new action invalidates the redo branch
    }
    void undo() { /* pop done -> undo() -> push undone */ }
    void redo() { /* pop undone -> execute() -> push done */ }
};`,

  "lld-problems-classic/lru-cache-design": `// Hash map + doubly linked list. The map gives O(1) lookup; the list gives
// O(1) reordering. Neither alone is enough — that pairing IS the answer.
struct Node { int key, val; Node *prev = nullptr, *next = nullptr; };

class LRUCache {
    int capacity;
    unordered_map<int, Node*> map;          // key -> node, so we never scan the list
    Node *head, *tail;                      // sentinels: head->next = MRU, tail->prev = LRU

    void unlink(Node* n) { n->prev->next = n->next; n->next->prev = n->prev; }
    void pushFront(Node* n);                // splice in just after head

public:
    explicit LRUCache(int cap);             // wires head <-> tail

    int get(int key) {
        auto it = map.find(key);
        if (it == map.end()) return -1;
        unlink(it->second); pushFront(it->second);   // touch = move to front
        return it->second->val;
    }

    void put(int key, int val) {
        if (map.count(key)) { unlink(map[key]); delete map[key]; }
        Node* n = new Node{key, val};
        map[key] = n; pushFront(n);
        if ((int)map.size() > capacity) {
            Node* lru = tail->prev;
            unlink(lru);
            map.erase(lru->key);            // evicting from the list alone leaks the key
            delete lru;
        }
    }
};`,

  "design-patterns-structural/composite": `// Composite = treat one thing and a group of things through one interface.
// A folder is asked its size exactly like a file is; the recursion is the point.
class Node {
public:
    virtual int  size() const = 0;
    virtual void print(int depth = 0) const = 0;
    virtual ~Node() = default;
};

class File : public Node {                  // LEAF — no children
    string name; int bytes;
public:
    int  size() const override { return bytes; }
    void print(int depth) const override;
};

class Folder : public Node {                // COMPOSITE — holds Nodes, is a Node
    string name;
    vector<unique_ptr<Node>> children;      // could be files, folders, or both
public:
    void add(unique_ptr<Node> n) { children.push_back(move(n)); }

    // The client never asks "is this a file or a folder?" — that question
    // disappearing is what the pattern buys you.
    int size() const override {
        int total = 0;
        for (auto& c : children) total += c->size();
        return total;
    }
    void print(int depth) const override;
};`,

  "design-patterns-behavioral/state": `// State = one class per state, each owning only the transitions legal from it.
// Replaces a status enum plus an if-ladder repeated in every method.
class VendingMachine;

class State {
public:
    virtual void insertCoin(VendingMachine&) { throw logic_error("not allowed here"); }
    virtual void select(VendingMachine&)     { throw logic_error("not allowed here"); }
    virtual void dispense(VendingMachine&)   { throw logic_error("not allowed here"); }
    virtual ~State() = default;
};

class VendingMachine {
    unique_ptr<State> state;
    int stock = 0;
public:
    void setState(unique_ptr<State> s) { state = move(s); }
    // Delegates everything — no branching on a status field lives here.
    void insertCoin() { state->insertCoin(*this); }
    void select()     { state->select(*this); }
};

class IdleState : public State {
    void insertCoin(VendingMachine& m) override { m.setState(make_unique<HasCoinState>()); }
};

class HasCoinState : public State {
    void select(VendingMachine& m) override { m.setState(make_unique<DispensingState>()); }
};

class DispensingState : public State {
    void dispense(VendingMachine& m) override { /* drop item, then back to Idle */ }
};`,

  "lld-problems-classic/tic-tac-toe": `enum class Symbol { EMPTY, X, O };

class Board {
    int n;
    vector<vector<Symbol>> grid;
public:
    explicit Board(int size) : n(size), grid(size, vector<Symbol>(size, Symbol::EMPTY)) {}
    bool isEmpty(int r, int c) const { return grid[r][c] == Symbol::EMPTY; }
    void place(int r, int c, Symbol s) { grid[r][c] = s; }
    int  size() const { return n; }
};

class Game {
    Board board;
    vector<Player*> players;
    int turn = 0, moves = 0;

    // Running counters instead of rescanning the board: +1 per X, -1 per O.
    // |counter| == n means that line is complete. O(1) per move, not O(n^2).
    vector<int> rowCount, colCount;
    int diag = 0, antiDiag = 0;

    bool wins(int r, int c, Symbol s) {
        int d = (s == Symbol::X) ? 1 : -1, n = board.size();
        rowCount[r] += d; colCount[c] += d;
        if (r == c)         diag     += d;
        if (r + c == n - 1) antiDiag += d;
        return abs(rowCount[r]) == n || abs(colCount[c]) == n
            || abs(diag) == n || abs(antiDiag) == n;
    }

public:
    GameStatus play(int r, int c) {
        // validate, place, then check the win with the symbol JUST placed —
        // rotating the turn first would report the wrong winner.
        Symbol s = players[turn]->symbol;
        board.place(r, c, s);
        if (wins(r, c, s))                  return GameStatus::WIN;
        if (++moves == board.size() * board.size()) return GameStatus::DRAW;
        turn = (turn + 1) % players.size();
        return GameStatus::IN_PROGRESS;
    }
};`,
};
